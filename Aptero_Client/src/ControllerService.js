import * as THREE from "three";


const LEFT_ORIGIN = [-0.3, -0.5, -0.3];
const RIGHT_ORIGIN = [0.3, -0.5, -0.3];

const blueButtonColor = new THREE.Color('#2b87ca');
const yellowButtonColor = new THREE.Color('#ede81f');

export interface Gamepad{
    index:number
}

export interface ControllerState{
    position: number[],
    rotation: number[],
    pressed: boolean,
}

export class Controller{
    index = -1;
    quaternion = new THREE.Quaternion(0, 0, 0, 0);
    euler = new THREE.Euler(0, 0, 0);

    constructor(index:number){
        this.index = index;
    }

    getGamepad(){
        const gamepads = navigator.getGamepads();
        return gamepads[this.index];
    }

    isPressed(){
        const gamepad = this.getGamepad();
        if (gamepad.buttons[0] && typeof gamepad.buttons[0] === 'object') {
            return gamepad.buttons[0].pressed;
        }else{
            return false;
        }
    }

    getHand():string{
        return this.getGamepad().hand;
    }

    getPosition():number[]{
        const gamepad = this.getGamepad();
        return [gamepad.pose.position[0],gamepad.pose.position[1],gamepad.pose.position[2]];
    }

    getQuaternion():number[]{
        const gamepad = this.getGamepad();
        return gamepad.pose.orientation;
    }

    getRotation():number[]{
        this.quaternion.fromArray(this.getQuaternion());
        this.euler.setFromQuaternion(this.quaternion);
        return [THREE.Math.radToDeg(this.euler.x), THREE.Math.radToDeg(this.euler.y), THREE.Math.radToDeg(this.euler.z)];
    }

    getControllerState():ControllerState{
        return {
            position:this.getPosition(),
            rotation:this.getRotation(),
            pressed:this.isPressed(),
        }
    }
}

export class ControllerService{

    controllers: {[id:number]:Controller} = {};

    constructor(){
        window.addEventListener('gamepadconnected', (e) => {
            let gamepad = e.gamepad;
            if (gamepad && gamepad.pose && gamepad.pose.orientation) {
                this.controllers[e.gamepad.index] = new Controller(e.gamepad.index);
            }
        });
        window.addEventListener('gamepaddisconnected', (e) => {
            delete this.controllers[e.gamepad.index];
        });
    }

    getGamepadsIds():number[] {
        return Object.keys(this.controllers);
    }

    getGamepads():Controller[] {
        let ret = [];
        Object.keys(this.controllers).forEach(key => {
            ret.push(this.controllers[key]);
        });
        return ret;
    }

}