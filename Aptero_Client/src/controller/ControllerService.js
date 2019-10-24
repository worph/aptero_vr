import * as THREE from "three";
import {Vector3} from "three";
import {Quaternion} from "three";
import {MouseController} from "./MouseController";
import {GamepadController} from "./GamepadController";

export class ControllerService {

    controllers: { [id: number]: Controller } = {};
    mouseController: Controller;

    createMouseController(r360) {
        this.mouseController = new MouseController(999, r360);
    }

    constructor(r360) {

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

    convertQuaternionToEuler(quat: []): number[] {
        let quaternion = new THREE.Quaternion(0, 0, 0, 0);
        let euler = new THREE.Euler(0, 0, 0);
        let vector = new THREE.Vector3(0, 0, 0);
        let lastRotation = [0, 0, 0];
        quaternion.fromArray(quat);
        euler.setFromQuaternion(quaternion);
        lastRotation[0] = THREE.Math.radToDeg(euler.x);
        lastRotation[1] = THREE.Math.radToDeg(euler.y);
        lastRotation[2] = THREE.Math.radToDeg(euler.z);
        return lastRotation;
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