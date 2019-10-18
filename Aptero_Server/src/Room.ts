let uuid = require('uuid');
const { uniqueNamesGenerator } = require('unique-names-generator');

export class RoomManager {

    rooms = [];

    create():Room {
        let room = new Room();
        this.rooms.push(room);
        return room;
    };

    get(id):Room {
        return (this.rooms.filter((room) => {
            return id === room.id;
        }) || [])[0];
    };

    remove(id):void{
      this.rooms = this.rooms.filter((room) => {
        return id !== room.id;
      });
    }

    getAll():Room[] {
        return this.rooms;
    };

}

export class Room {
    private peers: string[];
    private started: number;
    private id: string;

    data: any = {};

    constructor() {
        //this.id = uuid.v1();
        this.id = uniqueNamesGenerator({
            separator: '-', length: 2 }); // big-donkey
        this.started = Date.now();
        this.peers = [];
    }

    toJSON() {
        return {id: this.id, started: this.started, peers: this.peers};
    };

    addPeer(peerId: string) {
        this.peers.push(peerId);
    };

    updateRoomData(key: string, data: any) {
        if (!this.data[key]) {
            this.data[key] = {};
        }
        this.data[key] = {...this.data[key], ...data};
    }

    removeRoomDataEntry(key: string, keyEntry: string) {
        let data = this.data[key];
        delete data[keyEntry];
    }

    removeRoomData(key: string) {
        delete this.data[key];
    }

    getRoomData(): any {
        return this.data;
    }

    removePeer(peerId: string) {
        let index = this.peers.lastIndexOf(peerId);
        if (index !== -1) this.peers.splice(index, 1);
    };

}