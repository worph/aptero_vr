import Module from "react-360-web/js/Modules/Module";

export class BrowserBridgeNativeModule extends Module {

    constructor(ctx) {
        super('BrowserBridgeNativeModule');
        this._rnctx = ctx;
        this._bridgeName = 'BrowserBridge';
    }

    emit(eventName:string, eventData:any) {
        if (!this._rnctx) {
            return;
        }
        this._rnctx.callFunction(this._bridgeName, 'notifyEvent', [eventName, eventData]);
    }
}