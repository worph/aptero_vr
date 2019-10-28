import {MouseController} from "./MouseController";
import {GamepadController} from "./GamepadController";
import type {Controller} from "./ControllerInterface";
import {browserBridgeClient} from "../module/BrowserBridgeClient";

export class ControllerService {

    controllers: { [id: number]: Controller } = {};
    mouseController: Controller;
    vrButtonInProgress = false;

    createMouseController(r360) {
        this.mouseController = new MouseController(999, r360);
    }

    getVrButtonInProgress() {
        return this.vrButtonInProgress;
    }

    constructor(r360) {

        browserBridgeClient.onEvent("vrButtonStart",()=>{
            this.vrButtonInProgress = true;
            console.log("vrButtonStart");
        });
        browserBridgeClient.onEvent("vrButtonStop",()=>{
            this.vrButtonInProgress = false;
            console.log("vrButtonStop");
        });

        window.addEventListener('gamepadconnected', (e) => {
            let gamepad = e.gamepad;
            if (gamepad) {
                console.log("gamepadconnected : ", gamepad)
                this.controllers[gamepad.index] = new GamepadController(gamepad.index);
                if (this.controllers[gamepad.index].isVRReady()) {
                    this.mouseController.setActive(false);
                }
            }
        });
        window.addEventListener('gamepaddisconnected', (e) => {
            let gamepad = e.gamepad;
            delete this.controllers[gamepad.index];
        });
        if (navigator.getGamepads.forEach) {
            navigator.getGamepads().forEach(gamepad => {
                if (gamepad) {
                    console.log("gamepadconnected : ", gamepad);
                    this.controllers[gamepad.index] = new GamepadController(gamepad.index);
                }
            });
        } else {
            Object.keys(navigator.getGamepads()).forEach(gamepadkey => {
                let gamepad = navigator.getGamepads()[gamepadkey];
                if (gamepad) {
                    console.log("gamepadconnected : ", gamepad);
                    this.controllers[gamepad.index] = new GamepadController(gamepad.index);
                }
            });
        }
    }

    getGamepadsIds(): number[] {
        return Object.keys(this.controllers);
    }

    getGamepads(): GamepadController[] {
        let ret = [];
        ret.push(this.mouseController);
        Object.keys(this.controllers).forEach(key => {
            ret.push(this.controllers[key]);
        });
        return ret;
    }

}

export let controllerService = new ControllerService();