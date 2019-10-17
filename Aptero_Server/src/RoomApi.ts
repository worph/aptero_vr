import {RoomManager} from "./Room";

let express = require('express');

export class RoomApi {

    getRouter(rooms:RoomManager) {
        let router = express.Router();
        // Create a new room instance
        router.get('/new', function (req, res) {
            let call = rooms.create();
            res.json(call);
        });

        // Add PeerJS ID to Rooms instance when someone opens the page
        router.post('/:id/addpeer/:peerid', function (req, res) {
            let call = rooms.get(req.param('id'));
            if (!call) return res.status(404).send('Rooms not found');
            call.addPeer(req.param('peerid'));
            res.json(call.toJSON());
        });

        // Remove PeerJS ID when someone leaves the page
        router.post('/:id/removepeer/:peerid', function (req, res) {
            let call = rooms.get(req.param('id'));
            if (!call) return res.status(404).send('Rooms not found');
            call.removePeer(req.param('peerid'));
            res.json(call.toJSON());
        });

        // Return JSON representation of a Rooms
        router.get('/:id.json', function (req, res) {
            let call = rooms.get(req.param('id'));
            if (!call) return res.status(404).send('Rooms not found');
            res.json(call.toJSON());
        });

        return router;
    }
}
