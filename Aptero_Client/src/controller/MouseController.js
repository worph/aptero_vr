import * as THREE from "three";
import {Vector3} from "three";
import {Quaternion} from "three";
import type {Controller, ControllerState} from "./ControllerService";

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
