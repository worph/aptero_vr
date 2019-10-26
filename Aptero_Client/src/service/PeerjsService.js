// Handle prefixed versions
import $ from "jquery";
import EventEmitter from 'eventemitter3';
import {RoomsAPI} from "./RoomsAPI";

navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

interface Peer {
    outgoing: any,
    incoming: any,
    connection: any,
}

export class PeerjsService {
    eventEmitter = new EventEmitter();
    // State
    peerjs = {};
    myStream;
    peers: { [id=>string]: Peer } = {};
    room: {
        id: string,
        started: number,
        peers: string[]
    } = {id: "", started: 0, peers: []};
    roomApi:RoomsAPI;

    constructor(roomApi:RoomsAPI) {
        this.roomApi = roomApi;
    }

    async createCall() {
        this.room = await this.roomApi.createCallAPI();
        await this.initPeerJs();
        return this.room;
    }

    async setCall(id: string) {
        this.room = await this.roomApi.getCallAPI(id);
        await this.initPeerJs();
        return this.room;
    }

    async updateRoomData(roomid:string,key:string,data:any) {
        return this.roomApi.updateRoomData(this.room.id,key,data);
    }

    getRoomData(){
        return this.roomApi.getRoomData(this.room.id);
    }

    // Start everything up
    async initPeerJs(): boolean {
        if (!navigator.getUserMedia) return this.unsupported();
        await this.getLocalAudioStream();
        await this.connectToPeerJS();
        await this.roomApi.registerIdWithServerAPI(this.room.id,this.peerjs.id);
        this.peerjs.on('connection', (conn:any) => {
            let id = conn.peer;
            this.getPeer(id).connection = conn;
            conn.on('open', () => {
                console.log('data state connected to: ' + id);
                conn.on('data', (data) => {
                    this.processRequest(data);
                });
            });
        });
        if (this.room.peers.length) {
            this.callPeers();
            return false;
        } else {
            this.displayShareMessage();
            return true;
        }
    }

    sendData(peerId:string,event,data:any) {
        if (this.getPeer(peerId).connection) {
            this.getPeer(peerId).connection.send({
                event: event,
                data: data
            });
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

            this.peerjs.on('close', () => {
                this.disconnectedEvent(this.peerjs.id);
            });
            this.peerjs.on('disconnected', () => {
                this.disconnectedEvent(this.peerjs.id);
            });

            this.peerjs.on('error', (err) => {
                if(err.type==="peer-unavailable"){
                    let peerid = err.message.replace("Could not connect to peer ","");
                    this.disconnectedEvent(peerid);
                    console.log("removed "+peerid+" from room");
                }else{
                    console.error(err);
                    reject(err);
                }
            });
        });
        return res;
    }

    // Call each of the peer IDs using PeerJS
    callPeers() {
        this.room.peers.forEach((peerId) => {
            this.callPeer(peerId)
        });
    }

    processRequest(data: { event: string, data: any }) {
        this.eventEmitter.emit(data.event, data);
    }

    disconnectedEvent(id:string){
        console.log("disconnected",id);
        this.processRequest({event:"disconnected",data:{id:id}});
        return this.roomApi.unregisterIdWithServerAPI(this.room.id,id);
    }

    callPeer(peerId) {
        console.log('Calling ' + peerId + '...');
        let peer = this.getPeer(peerId);
        let id = peer.id;
        peer.outgoing = this.peerjs.call(peerId, this.myStream);

        peer.outgoing.on('error', (err) => {
            this.removePeer(id);
            this.disconnectedEvent(id);
        });

        peer.outgoing.on('stream', (stream) => {
            console.log('Connected to ' + peerId + '.');
            this.addIncomingStream(peer, stream);
        });
        let conn = this.peerjs.connect(id);
        this.getPeer(peer.id).connection = conn;
        conn.on('open', () => {
            console.log('data state connected to: ' + id);
            conn.on('data', (data) => {
                this.processRequest(data);
            });
            conn.on('close', () => {
                this.removePeer(id);
                this.disconnectedEvent(id);
            });
            conn.on('error', () => {
                this.removePeer(id);
                this.disconnectedEvent(id);
            });
        });
    }

    // When someone initiates a call via PeerJS
    handleIncomingCall(incoming) {
        console.log('Answering incoming call from ' + incoming.peer);
        let peer = this.getPeer(incoming.peer);
        let id = peer.id;
        peer.incoming = incoming;
        peer.incoming.on('error', (err) => {
            this.removePeer(id);
            this.disconnectedEvent(id);
        });

        incoming.answer(this.myStream);
        peer.incoming.on('stream', (stream) => {
            this.addIncomingStream(peer, stream);
        });
    }

    // Add the new audio stream. Either from an incoming call, or
    // from the response to one of our outgoing calls
    addIncomingStream(peer, stream) {
        console.log('Adding incoming stream from ' + peer.id);
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

    getCurrentRoomId():string{
        return this.room.id;
    }

    getMyPeerJsId():string{
        return this.peerjs.id;
    }

    ////////////////////////////////////
    // Helper functions
    removePeer(id:string){
        delete this.peers[id];
    }

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