import {Vector3, Quaternion} from 'three';
import {ObjectNotation} from "./ObjectNotation";

const MOVING_SPEED = 0.1;

import EventEmitter from "eventemitter3";

export const cameraControl = new EventEmitter();

export default class KeyboardCameraController {
    _movingZ = 0;
    _movingX = 0;

    constructor() {

        cameraControl.on("up", args => {
            this._moveForward();
        });
        cameraControl.on("down", args => {
            this._moveBackward();
        });
        cameraControl.on("left", args => {
            this._moveLeft();
        });
        cameraControl.on("right", args => {
            this._moveRight();
        });
        document.addEventListener('keydown', (event) => {
            if (event.keyCode === 38 /*|| event.keyCode === 87*/) {
                cameraControl.emit("up", {});
            } else if (event.keyCode === 40 /*|| event.keyCode === 83*/) {
                cameraControl.emit("down", {});
            } else if (event.keyCode === 37 /*|| event.keyCode === 65*/) {
                cameraControl.emit("left", {});
            } else if (event.keyCode === 39 /*|| event.keyCode === 68*/) {
                cameraControl.emit("right", {});
            }
        });
        window.addEventListener("message", (event) => {
            if (event.data.type === 'KEYBOARD_CAMERA_CONTROLLER_MESSAGE') {
                if (event.data.direction === 'UP') {
                    cameraControl.emit("up", {});
                } else if (event.data.direction === 'DOWN') {
                    cameraControl.emit("down", {});
                } else if (event.data.direction === 'LEFT') {
                    cameraControl.emit("left", {});
                } else if (event.data.direction === 'RIGHT') {
                    cameraControl.emit("right", {});
                }
            }
        }, false);
    }

    _moveForward() {
        this._movingZ = -MOVING_SPEED;
    }

    _moveBackward() {
        this._movingZ = MOVING_SPEED;
    }

    _moveLeft() {
        this._movingX = -MOVING_SPEED;
    }

    _moveRight() {
        this._movingX = MOVING_SPEED;
    }

    fillCameraProperties(positionArray, rotationArray) {
        if (this._movingZ === 0 && this._movingX === 0) {
            return false;
        }

        const quaternion = new Quaternion(rotationArray[0], rotationArray[1], rotationArray[2], rotationArray[3]);
        const position = new Vector3(positionArray[0], positionArray[1], positionArray[2]);

        const cameraObjectNotation = new ObjectNotation(position, quaternion);

        if (this._movingZ !== 0) {
            cameraObjectNotation.translateZ(this._movingZ);
        }

        if (this._movingX !== 0) {
            cameraObjectNotation.translateX(this._movingX);
        }

        positionArray[0] = cameraObjectNotation.position.x;
        // positionArray[1] = cameraObjectNotation.position.y; // i don't want to fly
        positionArray[2] = cameraObjectNotation.position.z;

        this._movingZ = 0;
        this._movingX = 0;

        console.log("here");

        return true;
    }
}