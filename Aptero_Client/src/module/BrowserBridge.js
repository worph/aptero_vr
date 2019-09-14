import BatchedBridge from 'react-native/Libraries/BatchedBridge/BatchedBridge';
import Module from "react-360-web/js/Modules/Module";

//https://stackoverflow.com/questions/51745727/is-it-possible-to-call-a-react-360-method-from-a-native-module?rq=1

export const BRIDGE_NAME = "BrowserBridge";

/**
 * Index.js part
 **/

export function registerCallableModule(){
    BatchedBridge.registerCallableModule(BRIDGE_NAME, browserBridge); //Call this in client js maybe?
}

export class BrowserBridge {
    constructor() {
        this._subscribers = {};
    }

    onEvent(eventName: string, handler: (data: any)=>void) {
        if (!this._subscribers[eventName]) {
            this._subscribers[eventName] = {};
        }
        let handlers = this._subscribers[eventName];
        const key = String(Math.random());
        handlers[key] = handler;
        return () => {
            delete handlers[key];
        };
    }

    notifyEvent(eventName, eventData) {
        let handlers = this._subscribers[eventName];
        Object.keys(handlers).forEach(key => {
            handlers[key](eventData);
        });
    }
}

export const browserBridge = new BrowserBridge();

/**
 * Client js part
 **/

export class BrowserBridgeNativeModule extends Module {

    constructor(ctx) {
        super('BrowserBridgeNativeModule');
        this._rnctx = ctx;
        this._bridgeName = BRIDGE_NAME;
    }

    emit(eventName:string, eventData:any) {
        if (!this._rnctx) {
            return;
        }
        this._rnctx.callFunction(this._bridgeName, 'notifyEvent', [eventName, eventData]);
    }
}


