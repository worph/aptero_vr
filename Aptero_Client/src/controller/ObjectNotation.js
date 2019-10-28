import {Vector3} from "three";

export class ObjectNotation {
    position = null;
    quaternion = null;

    constructor(position, quaternion) {
        this.position = position;
        this.quaternion = quaternion;
    }

    translateOnAxis = (axis, distance) => {
        const v1 = new Vector3();
        v1.copy(axis).applyQuaternion(this.quaternion);
        this.position.add(v1.multiplyScalar(distance));
    };

    translateX = (distance) => {
        this.translateOnAxis(new Vector3(1, 0, 0), distance);
    };
    translateY = (distance) => {
        this.translateOnAxis(new Vector3(0, 1, 0), distance);
    };
    translateZ = (distance) => {
        this.translateOnAxis(new Vector3(0, 0, 1), distance);
    };
}