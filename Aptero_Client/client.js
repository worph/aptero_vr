// This file contains the boilerplate to execute your React app.
// If you want to modify your application's content, start in "index.js"

require("babel-core/register");
require("babel-polyfill");

import {ReactInstance} from 'react-360-web';
import KeyboardCameraController from "./src/react/KeyboardCameraController";
import {PeerJsService} from "./src/peerjsService";

let host = window.location.href.startsWith("https://")?"https://meeting.aptero.co":"http://127.0.0.1:6767";
console.log("backend:"+host);
let peerJsService = new PeerJsService(host);
let split = window.location.href.split("#");
if(split.length===2){
    console.log("joining room : "+split[1]);
    let roomId = split[1].split("/")[1];
    peerJsService.setCall(roomId);
}else{
    console.log("creating room");
    peerJsService.createCall().then(() => {
        window.location.href = "index.html#room/" + peerJsService.call.id;
    })
}

function init(bundle, parent, options = {}) {
    const r360 = new ReactInstance(bundle, parent, {
        // Add custom options here
        fullScreen: true,
        ...options,
    });

    // Render your app content to the default cylinder surface
    /*r360.renderToSurface(
      r360.createRoot('Menu360', { }),
      r360.getDefaultSurface()
    );*/


    r360.renderToLocation(
        r360.createRoot('Room'),
        r360.getDefaultLocation(),
    );

    r360.renderToLocation(
        r360.createRoot('Participant'),
        r360.getDefaultLocation(),
    );

    // Load the initial environment
    r360.compositor.setBackground(r360.getAssetURL('360WorldSun.jpg'));
    r360.controls.addCameraController(new KeyboardCameraController());
    console.log(r360._cameraPosition,r360._cameraQuat)


}

window.React360 = {init};
