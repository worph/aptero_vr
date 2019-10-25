import Module from "react-360-web/js/Modules/Module";
import EventEmitter from "eventemitter3";

//https://stackoverflow.com/questions/51745727/is-it-possible-to-call-a-react-360-method-from-a-native-module?rq=1

/**
 * Client js part
 **/

export const BRIDGE_NAME = "BrowserBridge";
let eventEmitter = new EventEmitter();
let bridgeModule:BrowserBridgeNativeModule = null;

export class BrowserBridgeNativeModule extends Module {

    constructor(ctx) {
        super('BrowserBridgeNativeModule');
        this._rnctx = ctx;
        this._bridgeName = BRIDGE_NAME;
        bridgeModule = this;
    }

    notifyEventInternal(eventName,eventData){
        eventEmitter.emit(eventName,eventData);
    }

    emit(eventName:string, eventData:any) {
        if (!this._rnctx) {
            return;
        }
        if(!eventName || !eventData){
            throw new Error("invalid params");
        }
        this._rnctx.callFunction(this._bridgeName, 'notifyEventToIndex', [eventName, eventData]);
    }
}

export class BrowserBridgeClient {


    onEvent(eventName: string, handler: (data: any)=>void) {
        eventEmitter.on(eventName,handler);
        return () => {
            eventEmitter.off(eventName,handler);
        };
    }

    emit(event:string,data:any){
        bridgeModule.emit(event,data);
    }

}

export const browserBridgeClient = new BrowserBridgeClient();

