import * as THREE from "three";
import {Vector3} from "three";
import {Quaternion} from "three";


const LEFT_ORIGIN = [-0.3, -0.5, -0.3];
const RIGHT_ORIGIN = [0.3, -0.5, -0.3];

const blueButtonColor = new THREE.Color('#2b87ca');
const yellowButtonColor = new THREE.Color('#ede81f');

export interface Gamepad {
    index: number
}

export interface ControllerState {
    position: number[],
    rotation: number[],
    pressed: boolean,
    activated: boolean,
}

export interface Controller {
    isPressed():boolean;

    getHand(): string;

    getPosition(): number[];

    isVRReady():boolean;

    getQuaternion(): number[];

    getRotation(): number[];

    getHandPointer(): number[];

    getControllerState(): ControllerState;
}

const PRIMARY_ACTION_BUTTON = 1;

export class GamepadController implements Controller {
    index = -1;
    quaternion = new THREE.Quaternion(0, 0, 0, 0);
    euler = new THREE.Euler(0, 0, 0);
    vector = new THREE.Vector3(0, 0, 0);
    lastPosition = [0, 0, 0];
    lastRotation = [0, 0, 0];
    lastState: ControllerState = {
        position: [],
        rotation: [],
        pressed: false,
        activated: true,
    };

    constructor(index: number) {
        this.index = index;
    }

    getGamepad() {
        const gamepads = navigator.getGamepads();
        return gamepads[this.index];
    }

    isPressed() {
        const gamepad = this.getGamepad();
        if (gamepad.buttons[PRIMARY_ACTION_BUTTON] && typeof gamepad.buttons[PRIMARY_ACTION_BUTTON] === 'object') {
            return gamepad.buttons[PRIMARY_ACTION_BUTTON].pressed;
        } else {
            return false;
        }
    }

    getHand(): string {
        return this.getGamepad().hand;
    }

    getPosition(): number[] {
        const gamepad = this.getGamepad();
        this.lastPosition[0] = gamepad.pose.position[0];
        this.lastPosition[1] = gamepad.pose.position[1];
        this.lastPosition[2] = gamepad.pose.position[2];
        return this.lastPosition;
    }

    isVRReady() {
        const gamepad = this.getGamepad();
        return gamepad && gamepad.pose && gamepad.pose.orientation && gamepad.pose.position
    }

    getQuaternion(): number[] {
        const gamepad = this.getGamepad();
        return gamepad.pose.orientation;
    }

    convertQuaternionToEuler(quat: []): number[] {
        this.quaternion.fromArray(quat);
        this.euler.setFromQuaternion(this.quaternion);
        this.lastRotation[0] = THREE.Math.radToDeg(this.euler.x);
        this.lastRotation[1] = THREE.Math.radToDeg(this.euler.y);
        this.lastRotation[2] = THREE.Math.radToDeg(this.euler.z);
        return this.lastRotation;
    }

    getRotation(): number[] {
        return this.convertQuaternionToEuler(this.getQuaternion());
    }

    getHandPointer(): number[] {
        let handCenterPosition = this.getPosition();
        this.quaternion.fromArray(this.getQuaternion());
        this.vector.x = -0.05;
        this.vector.y = 0;
        this.vector.z = -0.1;
        this.vector.applyQuaternion(this.quaternion);
        this.lastPosition[0] = handCenterPosition[0] + this.vector.x;
        this.lastPosition[1] = handCenterPosition[1] + this.vector.y;
        this.lastPosition[2] = handCenterPosition[2] + this.vector.z;
        return this.lastPosition;

    }

    getControllerState(): ControllerState {
        this.lastState.position = this.getPosition();
        this.lastState.rotation = this.getRotation();
        this.lastState.pressed = this.isPressed();
        return this.lastState;
    }
}


export class MouseController implements Controller {
    index = -1;
    quaternion = new THREE.Quaternion(0, 0, 0, 0);
    euler = new THREE.Euler(0, 0, 0);
    vector = new THREE.Vector3(0, 0, 0);
    lastPosition = [0, 0, 0];
    r360;
    lastRotation = [0, 0, 0];
    lastState: ControllerState = {
        position: [],
        rotation: [],
        pressed: false,
        activated: true,
    };
    keyPressed = false;

    setActive(active: boolean) {
        this.lastState.activated = active;
    }

    constructor(index: number, r360: any) {
        this.r360 = r360;
        this.index = index;
        window.document.addEventListener('keydown', (event) => {
            if (event.keyCode === 32) {
                this.keyPressed = true;
            }
            if (event.keyCode === 84) {
                this.lastState.activated = !this.lastState.activated;
            }
        });
        window.document.addEventListener('keyup', (event) => {
            if (event.keyCode === 32) {
                this.keyPressed = false;
            }
        });
    }

    isPressed() {
        return this.keyPressed;
    }

    getHand(): string {
        return "right";
    }

    getPosition(): number[] {
        let pos = this.r360.getCameraPosition();
        let quat = this.r360.getCameraQuaternion();
        let posVector = new Vector3(pos[0], pos[1], pos[2]);
        let quaternion = new Quaternion(quat[0], quat[1], quat[2], quat[3]);
        let ray = new Vector3(0, 0, -0.5).applyQuaternion(quaternion);
        let ret: Vector3 = posVector.add(ray);
        this.lastPosition[0] = ret.x;
        this.lastPosition[1] = ret.y;
        this.lastPosition[2] = ret.z;
        return this.lastPosition;
    }

    isVRReady() {
        return true;
    }

    getQuaternion(): number[] {
        let quat = this.r360.getCameraQuaternion();
        return quat;
    }

    convertQuaternionToEuler(quat: []): number[] {
        this.quaternion.fromArray(quat);
        this.euler.setFromQuaternion(this.quaternion);
        this.lastRotation[0] = THREE.Math.radToDeg(this.euler.x);
        this.lastRotation[1] = THREE.Math.radToDeg(this.euler.y);
        this.lastRotation[2] = THREE.Math.radToDeg(this.euler.z);
        return this.lastRotation;
    }

    getRotation(): number[] {
        return this.convertQuaternionToEuler(this.getQuaternion());
    }

    getHandPointer(): number[] {
        let handCenterPosition = this.getPosition();
        this.quaternion.fromArray(this.getQuaternion());
        this.vector.x = -0.05;
        this.vector.y = 0;
        this.vector.z = -0.1;
        this.vector.applyQuaternion(this.quaternion);
        this.lastPosition[0] = handCenterPosition[0] + this.vector.x;
        this.lastPosition[1] = handCenterPosition[1] + this.vector.y;
        this.lastPosition[2] = handCenterPosition[2] + this.vector.z;
        return this.lastPosition;

    }

    getControllerState(): ControllerState {
        this.lastState.position = this.getPosition();
        this.lastState.rotation = this.getRotation();
        this.lastState.pressed = this.isPressed();
        return this.lastState;
    }
}

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