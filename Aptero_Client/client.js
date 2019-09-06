// This file contains the boilerplate to execute your React app.
// If you want to modify your application's content, start in "index.js"

import {BrowserBridgeNativeModule} from "./src/BrowserBridgeNativeModule";

require("babel-core/register");
require("babel-polyfill");

import {ReactInstance} from 'react-360-web';
import KeyboardCameraController from "./src/react/KeyboardCameraController";
import {PeerjsService} from "./src/PeerjsService";
import * as THREE from 'three';

/*
 * Handle room connection
 */
let host = window.location.href.startsWith("https://") ? "https://meeting.aptero.co" : "http://127.0.0.1:6767";
console.log("backend:" + host);
let peerJsService = new PeerjsService(host);
let split = window.location.href.split("#");
if (split.length === 2) {
    console.log("joining room : " + split[1]);
    let roomId = split[1].split("/")[1];
    peerJsService.setCall(roomId);
} else {
    console.log("creating room");
    peerJsService.createCall().then(() => {
        window.location.href = "index.html#room/" + peerJsService.call.id;
    })
}

/*
 * init
 */
function init(bundle, parent) {
    let controllerModule;
    const r360 = new ReactInstance(bundle, parent, {
        // Add custom options here
        fullScreen: true,
        assetRoot: 'static_assets/',
        // Register custom modules at init time
        nativeModules: [
            /*ctx => {
                controllerModule = new ControllersModule(ctx);
                return controllerModule;
            },**/
            ctx => {
                controllerModule = new BrowserBridgeNativeModule(ctx);
                return controllerModule;
            }
        ]
    });

    // Render your app content to the default cylinder surface
    /*r360.renderToSurface(
      r360.createRoot('Menu360', { }),
      r360.getDefaultSurface()
    );*/

    r360.renderToLocation(
        r360.createRoot('Env'),
        r360.getDefaultLocation(),
    );

    peerJsService.eventEmitter.on("new_user", (event: {
        event: string,
        data: {
            id: string
        }
    }) => {
        let id = event.data.id;
        console.log("display new user: " + id);
        r360.renderToLocation(
            r360.createRoot("Participant", {
                id: id, startVisible: true
            }),
            r360.getDefaultLocation()
        );
    });

    peerJsService.eventEmitter.on("player_state", (event: {
        event: "player_state",
        data: {
            id: string,
            position: number[],
            quaternion: number[]
        }
    }) => {
        let id = event.data.id;
        let position = event.data.position;
        let rotation = event.data.rotation;
        //controllerModule.setTransform(id,position, quaternion);
        controllerModule.emit("setTransform",{id:id,position:position,rotation:rotation})
    });


    // Load the initial environment
    r360.compositor.setBackground(r360.getAssetURL('360WorldSun.jpg'));
    r360.controls.addCameraController(new KeyboardCameraController());
    let quaternion = new THREE.Quaternion(0,0,0,0);
    let euler = new THREE.Euler( 0, 0, 0);
    setInterval(() => {
        quaternion.fromArray(r360._cameraQuat);
        euler.setFromQuaternion(quaternion);
        peerJsService.broadcastData("player_state",{
            id: peerJsService.peerjs.id,
            position: r360._cameraPosition,
            rotation: [THREE.Math.radToDeg(euler.x),THREE.Math.radToDeg(euler.y),THREE.Math.radToDeg(euler.z)]
        });
    }, 32);

}

window.React360 = {init};
