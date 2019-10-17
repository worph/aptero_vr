import {RoomApi} from "./RoomApi";
import {RoomManager, Room} from "./Room";

let path = require('path');
let express = require('express');
let cors = require('cors');

let app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

let rooms = new RoomManager()
let roomApi = new RoomApi();

app.use('/', roomApi.getRouter(rooms));

app.listen(6767);
console.log('Listening on 6767');