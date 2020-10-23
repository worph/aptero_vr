# How to realize a Client Server application using React, React360 and express

## Setting of express

_First Setup the express server to serve the static files and the rest API. It will be used to manage users_

_Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications._
```
let path = require('path');
let express = require('express');
let cors = require('cors');
let bodyParser = require('body-parser');

let app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

let rooms = new RoomManager();
let roomApi = new RoomApi();

app.use('/', roomApi.getRouter(rooms));

app.listen(6767);
console.log('Listening on 6767');

```

_Then we create some simple code to manage a room we will use simple rest API for simplicity:_

_The library helps you create a cache of your app's data on a device that's running your app. This cache, which serves as your app's single source of truth, allows users to view a consistent copy of key information within your app, regardless of whether users have an internet connection._
```
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

```
## Setting of react 360

_First setup react 360 application; You need 2 things_
_1) Attachment point for your app_
```
<div id="container"></div>
```
Initialize the React 360 application
```
<script>
        React360.init(
        'index.bundle?platform=vr&dev=true',
        document.getElementById('container')
    );
</script>
```
<![endif]-->

## The react 360 app system
The react 360 app is separated in 2 parts the react-360 worker and the react-360
### Web Worker Executor
So, we need to setup the component in the service worker part in index.js. Web Workers are a modern browser feature that allows code to run outside of the main window context. This is ideal for high-cost operations, or in our case, running code without interrupting the requestAnimationFrame loop. By default, React 360 uses a Web Worker to execute your React code. That means that any code found in your index.js runs inside a Web Worker environment, not the standard browser window. Because of this, you may find that certain APIs like window.location are inaccessible – this can be easily resolved with Native Modules. In fact, many common APIs like Location and History have already been provided for you
```
//example of a register component in react360
AppRegistry.registerComponent('RoomA', () => RoomA);
```
### Iframe Executor
Then we initialize the react 360 in the client part
There may be times when your environment does not support Web Workers. While this is unlikely, we provide a workaround that simulates a separate execution environment via an iframe. To use this instead of a Web Worker, initialize a ReactExecutorIframe and supply it at initialization time.
```
function init(bundle, parent) {
    const r360 = new ReactInstance(bundle, parent, {
        // Add custom options here
        fullScreen: true,
        assetRoot: 'static_assets/',
        // Add custom options here
        // Register custom modules at init time
        frame: ()=>{
          // Code 
        },
        nativeModules: [
	  // Register your native module here
        ]
    });
}

window.React360 = {init};
```
