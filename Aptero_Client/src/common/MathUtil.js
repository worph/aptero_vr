import * as THREE from "three";

let quaternion = new THREE.Quaternion(0, 0, 0, 0);
let euler = new THREE.Euler(0, 0, 0);
let lastHeadRotation = [0, 0, 0];

export function rotateByQuaternion(quat: number[]): number[] {
    /*head*/
    quaternion.fromArray(quat);
    euler.setFromQuaternion(quaternion);
    lastHeadRotation[0] = THREE.Math.radToDeg(euler.x);
    lastHeadRotation[1] = THREE.Math.radToDeg(euler.y);
    lastHeadRotation[2] = THREE.Math.radToDeg(euler.z);
    return lastHeadRotation;
}

export function rotateByQuaternionRad(quat: number[]): number[] {
    /*head*/
    quaternion.fromArray(quat);
    euler.setFromQuaternion(quaternion);
    lastHeadRotation[0] = euler.x;
    lastHeadRotation[1] = euler.y;
    lastHeadRotation[2] = euler.z;
    return lastHeadRotation;
}