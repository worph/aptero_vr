import * as THREE from "three";
import type {Controller, ControllerState} from "./ControllerService";
import {convertQuaternionToEuler} from "../common/MathUtil";

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

    lastButtonState = false;

    isInputProcessed(): boolean {
        return this.lastButtonState !== this.isPressed();
    }

    setInputProcessed(): void {
        this.lastButtonState = this.isPressed();
    }

    getIndex() {
        return this.index;
    }

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

    getRotation(): number[] {
        return convertQuaternionToEuler(this.getQuaternion());
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