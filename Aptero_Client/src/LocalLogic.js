import {MODE_DRAW, MODE_NOTE, POINT_RADIUS} from "./common/Color";
import {Paint3dDrawService} from "./service/Paint3dDrawService";
import {controllerService} from "./controller/ControllerService";
import {NoteService} from "./service/NoteService";
import {HandProcessor} from "./service/HandProcessor";
import type {Controller} from "./controller/ControllerInterface";
import {browserBridgeClient} from "./module/BrowserBridgeClient";
import {MenuService} from "./service/MenuService";

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
        let time = new Date().getTime();
        let controllerServiceLoc = controllerService;
        controllerServiceLoc.getGamepads().forEach(gamepad => {
            let gstate = gamepad.getControllerState();
            if (gamepad.isVRReady() && this.ownerId) {
                let handId = gamepad.index;
                this.handProcessor.processHand(this.ownerId, handId, gstate);
                let pos = gamepad.getHandPointer();
                let rot = gamepad.getRotation();
                this.noteService.moveSelectedNote(this.ownerId , gamepad.index, pos[0], pos[1], pos[2], rot);
                if (gstate.activated &&
                    gamepad.isPressed() &&
                    !controllerServiceLoc.getVrButtonInProgress() &&
                    (time-gamepad.getLastPressedTime())>50) {
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
        } else if (this.menuService.getMode() === MODE_NOTE && !gamepad.isInputProcessed()) {
            this.noteService.selectOrCreateNoteAt(owner, gamepad.index, x, y, z, rx, ry, rz, 0.2);
        } else {
            this.paint3d.removePointNear(x, y, z, POINT_RADIUS * 4);
        }
        gamepad.setInputProcessed();
    }

}