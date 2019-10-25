import Module from "react-360-web/js/Modules/Module";
import {BRIDGE_NAME} from "./BrowserBridgeIndex";

//https://stackoverflow.com/questions/51745727/is-it-possible-to-call-a-react-360-method-from-a-native-module?rq=1

/**
 * Client js part
 **/

export class BrowserBridgeNativeModule extends Module {

    constructor(ctx) {
        super('BrowserBridgeNativeModule');
        this._rnctx = ctx;
        this._bridgeName = BRIDGE_NAME;
    }

    _notifyEvent(eventName,eventData){
        console.log(eventName,eventData)
    }

    emit(eventName:string, eventData:any) {
        if (!this._rnctx) {
            return;
        }
        if(!eventName || !eventData){
            throw new Error("invalid params");
        }
        this._rnctx.callFunction(this._bridgeName, '_notifyEvent', [eventName, eventData]);
    }
}


