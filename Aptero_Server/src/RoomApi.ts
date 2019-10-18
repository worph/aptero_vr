import {RoomManager} from "./Room";

let express = require('express');

export class RoomApi {

    getRouter(rooms: RoomManager) {
        let router = express.Router();
        // Create a new room instance
        router.get('/new', (req, res) => {
            let room = rooms.create();
            res.json(room);
        });

        router.post('/:id/remove', (req, res) => {
            let room = rooms.remove(req.params.id);
            res.json("removed");
        });

        // Add PeerJS ID to Rooms instance when someone opens the page
        router.post('/:id/addpeer/:peerid', (req, res) => {
            let room = rooms.get(req.params.id);
            if (!room) return res.status(404).send('Rooms not found');
            room.addPeer(req.params.peerid);
            res.json(room.toJSON());
        });

        // Remove PeerJS ID when someone leaves the page
        router.post('/:id/removepeer/:peerid', (req, res) => {
            let room = rooms.get(req.params.id);
            if (!room) return res.status(404).send('Rooms not found');
            room.removePeer(req.params.peerid);
            res.json(room.toJSON());
        });

        router.get('/:id/data', (req, res) => {
            let room = rooms.get(req.params.id);
            if (!room) return res.status(404).send('Rooms not found');
            res.json(room.getRoomData());
        });

        router.post('/:id/data/add/:key', (req, res) => {
            let room = rooms.get(req.params.id);
            if (!room) return res.status(404).send('Rooms not found');
            room.updateRoomData(req.params.key, req.body);
            res.json("removed");
        });

        router.post('/:id/data/remove/:key/:entry', (req, res) => {
            let room = rooms.get(req.params.id);
            if (!room) return res.status(404).send('Rooms not found');
            room.removeRoomDataEntry(req.params.key, req.params.entry);
            res.json("removed");
        });

        router.post('/:id/data/remove/:key', (req, res) => {
            let room = rooms.get(req.params.id);
            if (!room) return res.status(404).send('Rooms not found');
            room.removeRoomData(req.params.key);
            res.json("removed");
        });

        // Return JSON representation of a Rooms
        router.get('/:id.json', (req, res) => {
            let room = rooms.get(req.params.id);
            if (!room) return res.status(404).send('Rooms not found');
            res.json(room.toJSON());
        });

        return router;
    }
}
