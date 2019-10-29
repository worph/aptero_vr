import * as THREE from "three";

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
    isPressed(): boolean;

    getIndex(): number;

    isNewInput(): boolean;

    setNewInputFalse(): void;

    getHand(): string;

    getPosition(): number[];

    isVRReady(): boolean;

    getQuaternion(): number[];

    getRotation(): number[];

    getHandPointer(): number[];

    getControllerState(): ControllerState;
}