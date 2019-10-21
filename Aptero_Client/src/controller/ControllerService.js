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
    vector = new THREE.Vector3( 0, 0, 0 );
    lastPosition = [0,0,0];
    lastRotation = [0,0,0];
    lastState = {};

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
        this.lastPosition[0]=gamepad.pose.position[0];
        this.lastPosition[1]=gamepad.pose.position[1];
        this.lastPosition[2]=gamepad.pose.position[2];
        return this.lastPosition;
    }

    isVRReady(){
        const gamepad = this.getGamepad();
        return gamepad && gamepad.pose && gamepad.pose.orientation && gamepad.pose.position
    }

    getQuaternion():number[]{
        const gamepad = this.getGamepad();
        return gamepad.pose.orientation;
    }

    convertQuaternionToEuler(quat:[]):number[]{
        this.quaternion.fromArray(quat);
        this.euler.setFromQuaternion(this.quaternion);
        this.lastRotation[0]=THREE.Math.radToDeg(this.euler.x);
        this.lastRotation[1]=THREE.Math.radToDeg(this.euler.y);
        this.lastRotation[2]=THREE.Math.radToDeg(this.euler.z);
        return this.lastRotation;
    }

    getRotation():number[]{
        return this.convertQuaternionToEuler(this.getQuaternion());
    }

    getHandPointer():number[]{
        let handCenterPosition = this.getPosition();
        this.quaternion.fromArray(this.getQuaternion());
        this.vector.x = -0.05;
        this.vector.y = 0;
        this.vector.z = -0.1;
        this.vector.applyQuaternion(this.quaternion);
        this.lastPosition[0]=handCenterPosition[0]+this.vector.x;
        this.lastPosition[1]=handCenterPosition[1]+this.vector.y;
        this.lastPosition[2]=handCenterPosition[2]+this.vector.z;
        return this.lastPosition;

    }

    getControllerState():ControllerState{
        this.lastState.position = this.getPosition();
        this.lastState.rotation = this.getRotation();
        this.lastState.pressed = this.isPressed();
        return this.lastState;
    }
}


export class ControllerService{

    controllers: {[id:number]:Controller} = {};


    convertQuaternionToEuler(quat:[]):number[]{
        let quaternion = new THREE.Quaternion(0, 0, 0, 0);
        let euler = new THREE.Euler(0, 0, 0);
        let vector = new THREE.Vector3( 0, 0, 0 );
        let lastRotation = [0,0,0];
        quaternion.fromArray(quat);
        euler.setFromQuaternion(quaternion);
        lastRotation[0]=THREE.Math.radToDeg(euler.x);
        lastRotation[1]=THREE.Math.radToDeg(euler.y);
        lastRotation[2]=THREE.Math.radToDeg(euler.z);
        return lastRotation;
    }

    constructor(){

        window.addEventListener('gamepadconnected', (e) => {
            let gamepad = e.gamepad;
            if(gamepad) {
                console.log("gamepadconnected : ", gamepad)
                this.controllers[gamepad.index] = new Controller(gamepad.index);
            }
        });
        window.addEventListener('gamepaddisconnected', (e) => {
            let gamepad = e.gamepad;
            delete this.controllers[gamepad.index];
        });
        if(navigator.getGamepads.forEach) {
            navigator.getGamepads().forEach(gamepad => {
                if(gamepad) {
                    console.log("gamepadconnected : ", gamepad);
                    this.controllers[gamepad.index] = new Controller(gamepad.index);
                }
            });
        }else{
            Object.keys(navigator.getGamepads()).forEach(gamepadkey => {
                let gamepad = navigator.getGamepads()[gamepadkey];
                if(gamepad) {
                    console.log("gamepadconnected : ", gamepad);
                    this.controllers[gamepad.index] = new Controller(gamepad.index);
                }
            });
        }
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

export let controllerService = new ControllerService();