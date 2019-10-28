import {MODE_DRAW, MODE_NOTE, POINT_RADIUS} from "./common/Color";
import {Paint3dDrawService} from "./service/Paint3dDrawService";
import {rotateByQuaternion} from "./common/MathUtil";
import {PeerjsService} from "./service/PeerjsService";
import {controllerService} from "./controller/ControllerService";
import {RoomsAPI} from "./service/RoomsAPI";
import {NoteService} from "./service/NoteService";
import {HandProcessor} from "./service/HandProcessor";
import {browserBridgeClient} from "./module/BrowserBridgeClient";
import type {NoteDTOData} from "./service/NoteService";
import {Location} from "react-360-web";
import {globalMove} from "./service/GlobalMove";

let FPS24 = 1000 / 24;

export class NetworkLogic {
    bridgeModule;
    r360;
    noteService: NoteService;
    paint3d: Paint3dDrawService;
    handProcessor: HandProcessor;

    peerJsService: PeerjsService;

    constructor(paint3d: Paint3dDrawService, noteService: NoteService, r360) {
        this.noteService = noteService;
        this.paint3d = paint3d;
        this.bridgeModule = browserBridgeClient;
        this.r360 = r360;
        this.handProcessor = new HandProcessor(r360);
    }

    loadPersistentData() {
        /*console.log("load persistent data");
        let points = this.peerJsService.getRoomData()["points"] || {};
        Object.keys(points).forEach(key => {
            let point = points[key];
            this.paint3d.addPointIfNotPresent(point.x, point.y, point.z, POINT_RADIUS, point);
        });
        console.log("finished persistent data");*/
    }

    setupPlayerState() {
        /*
         * Recv player state
         */
        this.peerJsService.eventEmitter.on("new_user", (event: {
            event: string,
            data: {
                id: string
            }
        }) => {
            let data = event.data;
            if (data.origin !== this.peerJsService.peerjs.id) {
                let id = data.id;
                let loc3 = new Location([0,0,0]);
                globalMove.locations.push(loc3);
                this.r360.renderToLocation(
                    this.r360.createRoot("ParticipantHead", {
                        id: id, startVisible: true
                    }),
                    loc3
                );
            }
        });
        this.peerJsService.eventEmitter.on("player_state", (event: {
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
            let data = event.data;
            if (data.origin !== this.peerJsService.peerjs.id) {
                let id = event.data.id;
                let position = event.data.position;
                let rotation = event.data.rotation;
                this.bridgeModule.emit("setHeadTransform", {id: id, position: position, rotation: rotation});
                let hands = event.data.hands;
                Object.keys(hands).forEach((handId) => {
                    let handPos = hands[handId].position;
                    let handRot = hands[handId].rotation;
                    this.handProcessor.processHand(id, handId, hands[handId],true);
                    this.noteService.moveSelectedNote(id, handId, handPos[0], handPos[1], handPos[2], handRot,true);
                });
            }

        });
        /*
         * Send player state
         */
        let payload = {id: this.peerJsService.getMyPeerJsId(), hands: {}};
        //network loop at 24 FPS
        setInterval(() => {
            /*hands*/
            controllerService.getGamepads().forEach(gamepad => {
                if (gamepad.isVRReady()) {
                    let state = gamepad.getControllerState();
                    state.position[0]-=controllerService.deltaX;
                    state.position[1]-=controllerService.deltaY;
                    state.position[2]-=controllerService.deltaZ;
                    payload.hands[gamepad.index] = state;
                }
            });

            /*send data*/
            payload.id = this.peerJsService.getMyPeerJsId();
            payload.position = [this.r360._cameraPosition[0],this.r360._cameraPosition[1],this.r360._cameraPosition[2]];
            payload.position[0]-=controllerService.deltaX;
            payload.position[1]-=controllerService.deltaY;
            payload.position[2]-=controllerService.deltaZ;
            payload.rotation = rotateByQuaternion(this.r360._cameraQuat);
            this.peerJsService.broadcastData("player_state", payload);
        }, FPS24);
    }

    setupPaint3dService() {
        this.peerJsService.eventEmitter.on("new_point", (event: {
            event: string,
            data: { id: string, x: number, y: number, z: number, color: string }
        }) => {
            let point = event.data;
            let data = event.data;
            if (data.origin !== this.peerJsService.peerjs.id) {
                this.paint3d.addPointIfNotPresent(point.x, point.y, point.z, POINT_RADIUS, point);
            }
        });
        this.paint3d.onPointAdded(data => {
            this.bridgeModule.emit("newPoint", data);
            if (data.origin === this.peerJsService.peerjs.id) {
                //if we created the point we broadcast to others
                this.peerJsService.broadcastData("new_point", data);
                this.peerJsService.updateRoomData(data.id, data);
            }
        });

        this.peerJsService.eventEmitter.on("remove_point", (event: {
            event: string,
            data: { id: string, x: number, y: number, z: number, color: string }
        }) => {
            let point = event.data;
            let data = event.data;
            if (data.origin !== this.peerJsService.peerjs.id) {
                this.paint3d.removePointNear(point.x, point.y, point.z, POINT_RADIUS);
            }
        });
        this.paint3d.onPointRemoved(data => {
            this.bridgeModule.emit("removePoint", data);
            if (data.origin === this.peerJsService.peerjs.id) {
                //if we created the point we broadcast to others
                this.peerJsService.broadcastData("remove_point", data);
            }
        });
    }

    setupNoteService() {
        /*
         * Note service
         */
        this.peerJsService.eventEmitter.on("new_note", (event: { event: string, data: NoteDTOData }) => {
            let data = event.data;
            if (data.origin !== this.peerJsService.peerjs.id) {
                this.noteService.createNoteAt(data.origin, data.hand, data.x, data.y, data.z, data.rx, data.ry, data.rz, false, data.id);
            }
        });
        this.noteService.onAdded((data: NoteDTOData) => {
            if (data.origin === this.peerJsService.peerjs.id) {
                //if we created the point we broadcast to others
                this.peerJsService.broadcastData("new_note", data);
            }
        });

        this.peerJsService.eventEmitter.on("note_select", (event: { event: string, data: { id: string, origin: string, hand: number } }) => {
            let data = event.data;
            if (data.origin !== this.peerJsService.peerjs.id) {
                this.noteService.selectNote(data.origin, data.hand, data.id);
            }
        });
        this.noteService.onSelect((data: { id: string, origin: string, hand: number }) => {
            if (data.origin === this.peerJsService.peerjs.id) {
                this.peerJsService.broadcastData("note_select", data);
            }
        });

        this.peerJsService.eventEmitter.on("note_deselect", (event: { event: string, data: { id: string, origin: string, hand: number } }) => {
            let data = event.data;
            if (data.origin !== this.peerJsService.peerjs.id) {
                this.noteService.deselectOwnedNote(data.origin, data.hand);
            }
        });
        this.noteService.onDeselect((data: { id: string, origin: string, hand: number }) => {
            if (data.origin === this.peerJsService.peerjs.id) {
                this.peerJsService.broadcastData("note_deselect", data);
            }
        });

        this.peerJsService.eventEmitter.on("note_text", (event: { event: string, data: { id: string, origin: string, text: string } }) => {
            let data = event.data;
            if (data.origin !== this.peerJsService.peerjs.id) {
                this.noteService.changeText(data.origin, data.id, data.text);
            }
        });
        this.noteService.onChangeText((data: { id: string, origin: string, text: string }) => {
            if (data.origin === this.peerJsService.peerjs.id) {
                this.peerJsService.broadcastData("note_text", data);
            }
        });
    }

    setupDisconnectService() {
        /*
         * RECV network event
         */
        this.peerJsService.eventEmitter.on("disconnected", (event: {
            event: "disconnected",
            data: {
                id: string
            }
        }) => {
            this.bridgeModule.emit("setHeadTransform", {id: event.data.id, position: [], rotation: []});
        });
        /*
         * SEND network event
         */

        window.onunload = () => {
            this.peerJsService.roomApi.unregisterIdWithServerAPI(this.peerJsService.getCurrentRoomId(), this.peerJsService.getMyPeerJsId())
        };
    }

    setupNetwork(): Promise<string> {
        return new Promise((resolve, reject) => {

            /*
             * Handle room connection
             */
            let host = window.location.href.startsWith("https://") ? "https://meeting.aptero.co" : "http://127.0.0.1:6767";//TODO add parameters
            console.log("backend:" + host);
            let roomsAPI: RoomsAPI = new RoomsAPI(host);
            this.peerJsService = new PeerjsService(roomsAPI);
            let split = window.location.href.split("#");
            if (split.length === 2) {
                console.log("joining room : " + split[1]);
                let roomId = split[1].split("/")[1];
                this.peerJsService.setCall(roomId).then(() => {
                    this.loadPersistentData();
                    resolve(this.peerJsService.getMyPeerJsId());
                });
            } else {
                console.log("creating room");
                this.peerJsService.createCall().then(() => {
                    window.location.href = "index.html#room/" + this.peerJsService.getCurrentRoomId();
                    this.loadPersistentData();
                    resolve(this.peerJsService.getMyPeerJsId());
                })
            }

            this.setupDisconnectService();
            this.setupPaint3dService();
            this.setupNoteService();
            this.setupPlayerState();
        })
    }
}