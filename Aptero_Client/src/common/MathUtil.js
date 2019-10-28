import * as THREE from "three";

let quaternion = new THREE.Quaternion(0, 0, 0, 0);
let euler = new THREE.Euler(0, 0, 0);
let lastRotation2 = [0, 0, 0];
let lastRotation = [0, 0, 0];
let lastPosition = [0, 0, 0];
let lastRotationQuat = [0, 0, 0,0];
let vector = new THREE.Vector3(0, 0, 0);

export function rotateByQuaternion(quat: number[]): number[] {
    /*head*/
    quaternion.fromArray(quat);
    euler.setFromQuaternion(quaternion);
    lastRotation2[0] = THREE.Math.radToDeg(euler.x);
    lastRotation2[1] = THREE.Math.radToDeg(euler.y);
    lastRotation2[2] = THREE.Math.radToDeg(euler.z);
    return lastRotation2;
}

export function rotateByQuaternionRad(quat: number[]): number[] {
    /*head*/
    quaternion.fromArray(quat);
    euler.setFromQuaternion(quaternion);
    lastRotation2[0] = euler.x;
    lastRotation2[1] = euler.y;
    lastRotation2[2] = euler.z;
    return lastRotation2;
}


export function ApplyQuaternionToVect(quat: number[],vect: number[]): number[] {
    quaternion.fromArray(quat);
    vector.x = vect[0];
    vector.y = vect[1];
    vector.z = vect[2];
    vector.applyQuaternion(quaternion);
    lastPosition[0] = vector.x;
    lastPosition[1] = vector.y;
    lastPosition[2] = vector.z;
    return lastPosition;
}

export function convertQuaternionToEuler(quat: []): number[] {
    quaternion.fromArray(quat);
    euler.setFromQuaternion(quaternion);
    lastRotation[0] = THREE.Math.radToDeg(euler.x);
    lastRotation[1] = THREE.Math.radToDeg(euler.y);
    lastRotation[2] = THREE.Math.radToDeg(euler.z);
    return lastRotation;
}

export function convertEulerToQuaternion(eulerArray: []): number[] {
    eulerArray[0] = THREE.Math.degToRad(eulerArray[0]);
    eulerArray[1] = THREE.Math.degToRad(eulerArray[1]);
    eulerArray[2] = THREE.Math.degToRad(eulerArray[2]);
    euler.fromArray(eulerArray);
    quaternion.setFromEuler(euler);
    lastRotationQuat[0] = quaternion.x;
    lastRotationQuat[1] = quaternion.y;
    lastRotationQuat[2] = quaternion.z;
    lastRotationQuat[3] = quaternion.w;
    return lastRotationQuat;
}