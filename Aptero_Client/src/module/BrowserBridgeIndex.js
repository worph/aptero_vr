import BatchedBridge from 'react-native/Libraries/BatchedBridge/BatchedBridge';
import EventEmitter from "eventemitter3";
import {NativeModules} from "react-360";

//https://stackoverflow.com/questions/51745727/is-it-possible-to-call-a-react-360-method-from-a-native-module?rq=1

export const BRIDGE_NAME = "BrowserBridge";

/**
 * Index.js part
 **/

const {BrowserBridgeNativeModule} = NativeModules;

export function registerCallableModule() {
    BatchedBridge.registerCallableModule(BRIDGE_NAME, new BrowserBridge()); //Call this in client js maybe?
}

let eventEmitter = new EventEmitter();

export class BrowserBridge {

    notifyEventToIndex(eventName, eventData) {
        eventEmitter.emit(eventName, eventData)
    }
}


export class BrowserBridgeIndex {

    onEvent(eventName: string, handler: (data: any)=>void) {
        eventEmitter.on(eventName, handler);
        return () => {
            eventEmitter.off(eventName, handler);
        };
    }

    emit(event: string, data: any) {
        BrowserBridgeNativeModule.notifyEventInternal(event, data);
    }

}


export const browserBridgeIndex = new BrowserBridgeIndex();