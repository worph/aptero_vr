import {MODE_DRAW, MODE_MOVE, MODE_NOTE, MODE_NOTE_CREATE, MODE_NOTE_EDIT, POINT_RADIUS} from "./common/Color";
import {Paint3dDrawService} from "./service/Paint3dDrawService";
import {controllerService} from "./controller/ControllerService";
import {NoteService} from "./service/NoteService";
import {HandProcessor} from "./service/HandProcessor";
import type {Controller} from "./controller/ControllerInterface";
import {browserBridgeClient} from "./module/BrowserBridgeClient";
import {MenuService} from "./service/MenuService";
import {cameraControl} from "./controller/KeyboardCameraController";
import {ApplyQuaternionToVect} from "./common/MathUtil";

let FPS60 = 1000 / 60;
let FPS24 = 1000 / 24;

export class LocalLogic {
    bridgeModule;
    noteService: NoteService;
    paint3d: Paint3dDrawService;
    r360;
    ownerId: string;
    handProcessor: HandProcessor;
    menuService: MenuService = new MenuService();

    constructor(paint3d: Paint3dDrawService, noteService: NoteService, r360) {
        this.noteService = noteService;
        this.paint3d = paint3d;
        this.bridgeModule = browserBridgeClient;
        this.r360 = r360;
        this.handProcessor = new HandProcessor(r360);
    }

    update() {

        /**
         //hand mapping
         **/
        //let time = new Date().getTime();
        let controllerServiceLoc = controllerService;
        controllerServiceLoc.getGamepads().forEach(gamepad => {
            let gstate = gamepad.getControllerState();
            /*gstate.position=[gstate.position[0],gstate.position[1],gstate.position[2]];
            gstate.position[0] -=controllerServiceLoc.deltaX;
            gstate.position[1] -=controllerServiceLoc.deltaY;
            gstate.position[2] -=controllerServiceLoc.deltaZ;*/
            if (gamepad.isVRReady() && this.ownerId) {
                let handId = gamepad.index;
                this.handProcessor.processHand(this.ownerId, handId, gstate, false);
                let pos = gamepad.getHandPointer();
                pos = [pos[0], pos[1], pos[2]];
                pos[0] -= controllerServiceLoc.deltaX;
                pos[1] -= controllerServiceLoc.deltaY;
                pos[2] -= controllerServiceLoc.deltaZ;
                let rot = gamepad.getRotation();
                this.noteService.moveSelectedNote(this.ownerId, gamepad.index, pos[0], pos[1], pos[2], rot, true);
                if (gstate.activated &&
                    gamepad.isPressed() &&
                    !controllerServiceLoc.getVrButtonInProgress()
                    //&& (time - gamepad.getLastPressedTime()) > 25
                ) {
                    this.actionAt(this.ownerId, gamepad, pos[0], pos[1], pos[2], rot[0], rot[1], rot[2]);
                }
            }
        });
    }

    actionAt(owner: string, gamepad: Controller, x, y, z, rx, ry, rz) {
        if (this.menuService.getMode() === MODE_DRAW) {
            this.paint3d.addPointIfNotPresent(x, y, z, POINT_RADIUS, {
                color: this.menuService.getColor(),
                origin: owner
            });
        } else if (this.menuService.getMode() === MODE_NOTE_CREATE && gamepad.isNewInput()) {
            this.noteService.selectOrCreateNoteAt(owner, gamepad.index, x, y, z, rx, ry, rz, 0.6);
        } else if (this.menuService.getMode() === MODE_NOTE_EDIT && gamepad.isNewInput()) {
            this.noteService.startOrStopEdit(owner, gamepad.index, x, y, z, 0.5)
        } else if (this.menuService.getMode() === MODE_MOVE) {
            //this.noteService.deselectOwnedNote(owner, gamepad.index);
            let vect = ApplyQuaternionToVect(this.r360.getCameraQuaternion(), [0, 0, 0.1]);
            cameraControl.emit("move_scene", {move: vect});
        } else {
            this.paint3d.removePointNear(x, y, z, POINT_RADIUS * 4);
        }
        gamepad.setNewInputFalse();
    }

}