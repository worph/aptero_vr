import {MODE_DRAW, MODE_NOTE, POINT_RADIUS} from "./common/Color";
import {Paint3dDrawService} from "./service/Paint3dDrawService";
import {rotateByQuaternion} from "./common/MathUtil";
import {PeerjsService} from "./service/PeerjsService";
import {controllerService} from "./controller/ControllerService";
import {RoomsAPI} from "./service/RoomsAPI";
import {NoteService} from "./service/NoteService";
import {HandProcessor} from "./HandProcessor";

let FPS24 = 1000 / 24;

export class NetworkLogic {
    bridgeModule;
    colorModule;
    r360;
    noteService: NoteService;
    paint3d:Paint3dDrawService;
    handProcessor: HandProcessor;

    peerJsService: PeerjsService;

    constructor(paint3d:Paint3dDrawService,noteService: NoteService,bridgeModule,colorModule,r360) {
        this.noteService = noteService;
        this.paint3d = paint3d;
        this.bridgeModule = bridgeModule;
        this.colorModule = colorModule;
        this.r360 = r360;
        this.handProcessor = new HandProcessor(r360,bridgeModule);
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

    setupIncomingEventListeners(){

        /*
         * Handle network event
         */
        this.peerJsService.eventEmitter.on("new_user", (event: {
            event: string,
            data: {
                id: string
            }
        }) => {
            let id = event.data.id;
            this.r360.renderToLocation(
                this.r360.createRoot("ParticipantHead", {
                    id: id, startVisible: true
                }),
                this.r360.getDefaultLocation()
            );
        });

        this.peerJsService.eventEmitter.on("new_point", (event: {
            event: string,
            data: { id: string, x: number, y: number, z: number, color: string }
        }) => {
            let point = event.data;
            this.paint3d.addPointIfNotPresent(point.x, point.y, point.z, POINT_RADIUS, point);
        });

        this.peerJsService.eventEmitter.on("remove_point", (event: {
            event: string,
            data: { id: string, x: number, y: number, z: number, color: string }
        }) => {
            let point = event.data;
            this.paint3d.removePointNear(point.x, point.y, point.z, POINT_RADIUS);
        });


        this.peerJsService.eventEmitter.on("disconnected", (event: {
            event: "disconnected",
            data: {
                id: string
            }
        }) => {
            this.bridgeModule.emit("setHeadTransform", {id: event.data.id, position: [], rotation: []});
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
            let id = event.data.id;
            let position = event.data.position;
            let rotation = event.data.rotation;
            this.bridgeModule.emit("setHeadTransform", {id: id, position: position, rotation: rotation});
            let hands = event.data.hands;
            Object.keys(hands).forEach((handId) => {
                this.processHand(id, handId, hands[handId]);
            });

        });
    }

    setupNetwork():Promise<string> {
        return new Promise((resolve, reject) => {

            /*
             * Handle room connection
             */
            let host = window.location.href.startsWith("https://") ? "https://meeting.aptero.co" : "http://127.0.0.1:6767";
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

            this.setupIncomingEventListeners();

            /*
             * send network event
             */

            window.onunload = () => {
                this.peerJsService.roomApi.unregisterIdWithServerAPI(this.peerJsService.getCurrentRoomId(), this.peerJsService.getMyPeerJsId())
            };

            /* paint 3d */
            this.paint3d.onPointAdded(data => {
                this.bridgeModule.emit("newPoint", data);
                if (data.origin === this.peerJsService.peerjs.id) {
                    //if we created the point we broadcast to others
                    this.peerJsService.broadcastData("new_point", data);
                    this.peerJsService.updateRoomData(data.id, data);
                }
            });
            this.paint3d.onPointRemoved(data => {
                this.bridgeModule.emit("removePoint", data);
                if (data.origin === this.peerJsService.peerjs.id) {
                    //if we created the point we broadcast to others
                    this.peerJsService.broadcastData("remove_point", data);
                }
            });

            let payload = {id: this.peerJsService.getMyPeerJsId(), hands: {}};
            //network loop at 24 FPS
            setInterval(() => {
                /*
                 * network state logic
                 */
                /*hands*/
                controllerService.getGamepads().forEach(gamepad => {
                    if (gamepad.isVRReady()) {
                        let state = gamepad.getControllerState();
                        payload.hands[gamepad.index] = state;
                    }
                });

                /*send data*/
                payload.id = this.peerJsService.getMyPeerJsId();
                payload.position = this.r360._cameraPosition;
                payload.rotation = rotateByQuaternion(this.r360._cameraQuat);
                this.peerJsService.broadcastData("player_state", payload);
            }, FPS24);
        })
    }
}