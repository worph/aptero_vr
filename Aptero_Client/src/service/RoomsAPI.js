import axios from "axios";

export class RoomsAPI{
    APIHost: string;

    constructor(APIHost: string) {
        this.APIHost = APIHost;
    }

    // Add our ID to the list of PeerJS IDs for this call
    async createCallAPI(): Promise<any> {
        return axios.get(this.APIHost + '/new').then(res => {
            return res.data;
        });
    }


    // Add our ID to the list of PeerJS IDs for this call
    async getCallAPI(id: string): Promise<any> {
        return axios.get(this.APIHost + '/' + id + ".json").then(res => {
            return res.data;
        });
    }

    // Add our ID to the list of PeerJS IDs for this call
    async registerIdWithServerAPI(roomid:string,peerJsId:string) {
        if(!roomid) throw new Error("invalid parameters");
        return axios.post(this.APIHost + '/' + roomid + '/addpeer/' + peerJsId);
    }

    // Remove our ID from the call's list of IDs
    async unregisterIdWithServerAPI(roomid:string,peerJsId:string) {
        if(!roomid) throw new Error("invalid parameters");
        return axios.post(this.APIHost + '/' + roomid + '/removepeer/' + peerJsId);
    }

    async getRoomData(roomid:string) {
        if(!roomid) throw new Error("invalid parameters");
        return axios.get(this.APIHost + '/' + roomid + '/data').then(res => {
            return res.data;
        });
    }

    async updateRoomData(roomid:string,key:string,data:any) {
        if(!roomid) throw new Error("invalid parameters");
        return axios.post(this.APIHost + '/' + roomid + '/data/add/'+key,data).then(res => {
            return res.data;
        });
    }

    async removeRoomDataEntry(roomid:string,key:string,entry:string) {
        if(!roomid) throw new Error("invalid parameters");
        return axios.post(this.APIHost + '/' + roomid + '/data/remove/'+key+"/"+entry).then(res => {
            return res.data;
        });
    }

    async removeRoomData(roomid:string,key:string) {
        if(!roomid) throw new Error("invalid parameters");
        return axios.post(this.APIHost + '/' + roomid + '/data/remove/'+key).then(res => {
            return res.data;
        });
    }
}