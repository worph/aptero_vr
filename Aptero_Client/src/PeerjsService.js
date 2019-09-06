// Handle prefixed versions
import axios from 'axios';
import $ from "jquery";
import EventEmitter from 'eventemitter3';

navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

interface Peer {
    outgoing: any,
    incoming: any,
    connection: any,
}

export class PeerjsService {
    APIHost: string;
    eventEmitter = new EventEmitter();
    // State
    peerjs = {};
    myStream;
    peers: { [id=>string]: Peer } = {};
    call: {
        id: string,
        started: number,
        peers: string[]
    } = {id: "", started: 0, peers: []};

    constructor(APIHost: string) {
        this.APIHost = APIHost;
    }

    async createCall() {
        this.call = await this.createCallAPI();
        await this.initPeerJs();
        return this.call;
    }

    async setCall(id: string) {
        this.call = await this.getCallAPI(id);
        await this.initPeerJs();
        return this.call;
    }

    // Start everything up
    async initPeerJs(): boolean {
        if (!navigator.getUserMedia) return this.unsupported();
        await this.getLocalAudioStream();
        await this.connectToPeerJS();
        await this.registerIdWithServerAPI(this.peerjs.id);
        this.peerjs.on('connection', (conn) => {
            let id = conn.peer;
            this.getPeer(id).connection = conn;
            conn.on('open', () => {
                console.log('data state connected to: ' + id);
                conn.on('data', (data) => {
                    this.processRequest(data);
                });
            });
        });
        if (this.call.peers.length) {
            this.callPeers();
            return false;
        } else {
            this.displayShareMessage();
            return true;
        }
    }

    broadcastData(event,data:any) {
        Object.keys(this.peers).forEach((peerId) => {
            if(peerId!==this.peerjs.id) {
                if (this.getPeer(peerId).connection) {
                    this.getPeer(peerId).connection.send({
                        event: event,
                        data: data
                    });
                }
            }
        });
    }

    // Connect to PeerJS and get an ID
    async connectToPeerJS() {
        let res = await new Promise((resolve, reject) => {
            this.display('Connecting to PeerJS...');
            this.peerjs = new Peer();

            this.peerjs.on('call', (incoming) => {
                this.handleIncomingCall(incoming)
            });

            this.peerjs.on('open', () => {
                this.display('Connected.');
                this.display('ID: ' + this.peerjs.id);
                resolve(this.peerjs);
            });

            this.peerjs.on('error', (err) => {
                this.display(err);
                reject(err);
            });
        });
        return res;
    }

    // Add our ID to the list of PeerJS IDs for this call
    async createCallAPI(): Promise<any> {
        this.display('Registering ID with server...');
        return axios.get(this.APIHost + '/new').then(res => {
            return res.data;
        });
    }


    // Add our ID to the list of PeerJS IDs for this call
    async getCallAPI(id: string): Promise<any> {
        this.display('Registering ID with server...');
        return axios.get(this.APIHost + '/' + id + ".json").then(res => {
            return res.data;
        });
    }

    // Add our ID to the list of PeerJS IDs for this call
    async registerIdWithServerAPI() {
        this.display('Registering ID with server...');
        return axios.post(this.APIHost + '/' + this.call.id + '/addpeer/' + this.peerjs.id);
    }

    // Remove our ID from the call's list of IDs
    async unregisterIdWithServerAPI() {
        return axios.post(this.APIHost + '/' + this.call.id + '/removepeer/' + this.peerjs.id);
    }

    // Call each of the peer IDs using PeerJS
    callPeers() {
        this.call.peers.forEach((peerId) => {
            this.callPeer(peerId)
        });
    }

    processRequest(data: { event: string, data: any }) {
        this.eventEmitter.emit(data.event, data);
    }

    callPeer(peerId) {
        this.display('Calling ' + peerId + '...');
        let peer = this.getPeer(peerId);
        peer.outgoing = this.peerjs.call(peerId, this.myStream);

        peer.outgoing.on('error', (err) => {
            this.display(err);
        });

        peer.outgoing.on('stream', (stream) => {
            this.display('Connected to ' + peerId + '.');
            this.addIncomingStream(peer, stream);
        });
        let id = peer.id;
        let conn = this.peerjs.connect(id);
        this.getPeer(peer.id).connection = conn;
        conn.on('open', () => {
            console.log('data state connected to: ' + id);
            conn.on('data', (data) => {
                this.processRequest(data);
            });
        });
    }

    // When someone initiates a call via PeerJS
    handleIncomingCall(incoming) {
        this.display('Answering incoming call from ' + incoming.peer);
        let peer = this.getPeer(incoming.peer);
        peer.incoming = incoming;
        incoming.answer(this.myStream);
        peer.incoming.on('stream', (stream) => {
            this.addIncomingStream(peer, stream);
        });
    }

    // Add the new audio stream. Either from an incoming call, or
    // from the response to one of our outgoing calls
    addIncomingStream(peer, stream) {
        this.display('Adding incoming stream from ' + peer.id);
        peer.incomingStream = stream;
        this.playStream(stream);

        this.eventEmitter.emit("new_user", {
            event: "new_user",
            data: {
                id: peer.id
            }
        });
    }

    // Create an <audio> element to play the audio stream
    playStream(stream) {
        let audio = $('<audio autoplay />').appendTo('body');
        audio[0].srcObject = stream;
    }

    // Get access to the microphone
    async getLocalAudioStream(): any {
        return new Promise((resolve, reject) => {
            this.display('Trying to access your microphone. Please click "Allow".');
            navigator.getUserMedia(
                {video: false, audio: true},

                (audioStream) => {
                    this.display('Microphone is open.');
                    this.myStream = audioStream;
                    resolve(audioStream);
                },
                (err) => {
                    this.display('Couldn\'t connect to microphone. Reload the page to try again.');
                    reject(err);
                }
            );
        })
    }


    ////////////////////////////////////
    // Helper functions
    getPeer(peerId): Peer {
        return this.peers[peerId] || (this.peers[peerId] = {id: peerId});
    }

    displayShareMessage() {
        console.log('Give someone this URL to chat.');
    }

    unsupported() {
        console.error("Your browser doesn't support getUserMedia.");
    }

    display(message) {
        console.log(message);
    }
}