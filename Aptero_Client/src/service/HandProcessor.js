import type {ControllerState} from "../controller/ControllerService";
import {browserBridgeClient} from "../module/BrowserBridgeClient";

export class HandProcessor {

    knownHandIds: { [id: string]: { [id: number]: any } } = {};
    inputAvailable: boolean[] = [];
    lastInputState: boolean[] = [];

    r360;
    bridgeModule;

    constructor(r360) {
        this.r360 = r360;
        this.bridgeModule = browserBridgeClient;
    }

    /*
    Input and hand processing
     */
    processHand(id: string, handId: number, data: ControllerState) {
        if (!this.knownHandIds[id]) {
            this.knownHandIds[id] = {};
        }
        if (!this.knownHandIds[id][handId]) {
            this.knownHandIds[id][handId] = true;
            console.log("new hand");
            this.r360.renderToLocation(
                this.r360.createRoot("ParticipantHand", {
                    id: id, handId: handId, startVisible: true
                }),
                this.r360.getDefaultLocation()
            );
        } else {
            this.bridgeModule.emit("setHandTransform", {
                id: id,
                handId: handId,
                ...data
            })
        }
    }
}