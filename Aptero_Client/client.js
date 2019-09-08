// This file contains the boilerplate to execute your React app.
// If you want to modify your application's content, start in "index.js"

import {BrowserBridgeNativeModule} from "./src/BrowserBridgeNativeModule";

require("babel-core/register");
require("babel-polyfill");

import {ReactInstance} from 'react-360-web';
import KeyboardCameraController from "./src/react/KeyboardCameraController";
import {PeerjsService} from "./src/PeerjsService";
import * as THREE from 'three';
import {ControllerService} from "./src/ControllerService";
import type {ControllerState} from "./src/ControllerService";
import {Paint3dDrawService} from "./src/Paint3dDrawService";
import {POINT_RADIUS, RED} from "./src/Color";

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

let FPS60 = 1000 / 60;
let FPS24 = 1000 / 24;

let MODE_DRAW = "draw";
let MODE_ERASE = "erase";

/*
 * init
 */
function init(bundle, parent) {
    /*
    Init
     */
    let bridgeModule;
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
                bridgeModule = new BrowserBridgeNativeModule(ctx);
                return bridgeModule;
            }
        ]
    });

    // Render your app content to the default cylinder surface
    r360.renderToSurface(
        r360.createRoot('Menu360', {}),
        r360.getDefaultSurface()
    );

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
        r360.renderToLocation(
            r360.createRoot("ParticipantHead", {
                id: id, startVisible: true
            }),
            r360.getDefaultLocation()
        );
        /*broadcast my points*/
        paint3d.getAll().forEach(pointData => {
            peerJsService.broadcastData("new_point", pointData);
        })
    });

    peerJsService.eventEmitter.on("new_point", (event: {
        event: string,
        data: {
            id: string
        }
    }) => {
        let point = event.data;
        paint3d.addPointIfNotPresent(point.x, point.y, point.z, POINT_RADIUS, point);
    });


    // Load the initial environment
    r360.compositor.setBackground(r360.getAssetURL('360WorldSun.jpg'));
    r360.controls.addCameraController(new KeyboardCameraController());

    /* paint 3d */
    let paint3d = new Paint3dDrawService();
    paint3d.onPointAdded(data => {
        r360.renderToLocation(
            r360.createRoot("Point", {
                id: data.id, x: data.x, y: data.y, z: data.z, color: data.color
            }),
            r360.getDefaultLocation()
        );
        if (data.origin === peerJsService.peerjs.id) {
            //if we created the point we broadcast to others
            peerJsService.broadcastData("new_point", data);
        }
    });
    paint3d.onPointRemoved(data => {

    });
    let currentColor = RED;
    let currentMode = MODE_DRAW;

    /*
    Input and hand processing
     */

    let controllerService = new ControllerService();
    let knownHandIds: { [id: string]: { [id: number]: any } } = {};

    function processHand(id: string, handId: number, data: ControllerState) {
        if (!knownHandIds[id]) {
            knownHandIds[id] = {};
        }
        if (!knownHandIds[id][handId]) {
            knownHandIds[id][handId] = true;
            console.log("new hand");
            r360.renderToLocation(
                r360.createRoot("ParticipantHand", {
                    id: id, handId: handId, startVisible: true
                }),
                r360.getDefaultLocation()
            );
        } else {
            bridgeModule.emit("setHandTransform", {
                id: id,
                handId: handId,
                ...data
            })
        }
    }

    //render loop at 60 FPS
    setInterval(() => {
        controllerService.getGamepads().forEach(gamepads => {
            let handId = gamepads.index;
            processHand(peerJsService.peerjs.id, handId, gamepads.getControllerState());
            if (gamepads.isPressed()) {
                let pos = gamepads.getPosition();
                if (currentMode === MODE_DRAW) {
                    paint3d.addPointIfNotPresent(pos[0], pos[1], pos[2], POINT_RADIUS, {
                        id: paint3d.getNextUniqueId(),
                        color: currentColor,
                        origin: peerJsService.peerjs.id
                    });
                } else {
                    paint3d.removePointNear(pos[0], pos[1], pos[2], POINT_RADIUS);
                }
            }
        })
    }, FPS60);

    peerJsService.eventEmitter.on("player_state", (event: {
        event: "player_state",
        data: {
            id: string,
            position: number[],
            rotation: number[],
            hands: {
                [id: number]: {
                    position: number[],
                    rotation: number[],
                    pressed: boolean,
                }
            }
        }
    }) => {
        let id = event.data.id;
        let position = event.data.position;
        let rotation = event.data.rotation;
        bridgeModule.emit("setHeadTransform", {id: id, position: position, rotation: rotation});
        let hands = event.data.hands;
        Object.keys(hands).forEach((handId) => {
            processHand(id, handId, hands[handId]);
        });

    });

    let quaternion = new THREE.Quaternion(0, 0, 0, 0);
    let euler = new THREE.Euler(0, 0, 0);
    //network loop at 24 FPS
    setInterval(() => {
        /*
         * network state logic
         */
        /*hands*/
        let hands = {};
        controllerService.getGamepads().forEach(gamepad => {
            hands[gamepad.index] = {
                position: gamepad.getPosition(),
                rotation: gamepad.getRotation(),
                pressed: gamepad.isPressed(),
            }
        });

        /*head*/
        quaternion.fromArray(r360._cameraQuat);
        euler.setFromQuaternion(quaternion);

        /*send data*/
        peerJsService.broadcastData("player_state", {
            id: peerJsService.peerjs.id,
            position: r360._cameraPosition,
            rotation: [THREE.Math.radToDeg(euler.x), THREE.Math.radToDeg(euler.y), THREE.Math.radToDeg(euler.z)],
            hands: hands
        });
    }, FPS24);


}

window.React360 = {init};
