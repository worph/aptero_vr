import BatchedBridge from 'react-native/Libraries/BatchedBridge/BatchedBridge';
import Module from "react-360-web/js/Modules/Module";
import EventEmitter from "eventemitter3";
import {NativeModules} from "react-360";

//https://stackoverflow.com/questions/51745727/is-it-possible-to-call-a-react-360-method-from-a-native-module?rq=1

export const BRIDGE_NAME = "BrowserBridge";

/**
 * Index.js part
 **/

const {BrowserBridgeNativeModule} = NativeModules;

export function registerCallableModule(){
    BatchedBridge.registerCallableModule(BRIDGE_NAME, browserBridge); //Call this in client js maybe?
}

export class BrowserBridge {

    eventEmitter = new EventEmitter();

    constructor() {
        this._subscribers = {};
    }

    onEvent(eventName: string, handler: (data: any)=>void) {
        this.eventEmitter.on(eventName,handler);
        return () => {
            this.eventEmitter.off(eventName,handler);
        };
    }

    emit(event:string,data:any){
        BrowserBridgeNativeModule._notifyEvent(event,data);
    }

    _notifyEvent(eventName, eventData) {
        this.eventEmitter.emit(eventName,eventData)
    }
}

export const browserBridge = new BrowserBridge();