
import EventEmitter from "eventemitter3";

export class SceneManager {
    eventEmitter = new EventEmitter();
}

export let sceneManager = new SceneManager();