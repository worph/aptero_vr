let uuid = require('uuid');

export class RoomManager{

  rooms = [];

  create() {
    let call = new Room();
    this.rooms.push(call);
    return call;
  };

  get(id) {
    return (this.rooms.filter((call) => {
      return id === call.id;
    }) || [])[0];
  };

  getAll() {
    return this.rooms;
  };

}

export class Room {
  private peers: string[];
  private started: number;
  private id: string;

  constructor(){
      this.id = uuid.v1();
      this.started = Date.now();
      this.peers = [];
  }

  toJSON() {
    return {id: this.id, started: this.started, peers: this.peers};
  };

  addPeer(peerId:string) {
    this.peers.push(peerId);
  };

  removePeer(peerId:string) {
    let index = this.peers.lastIndexOf(peerId);
    if (index !== -1) this.peers.splice(index, 1);
  };

}