import type {ControllerState} from "../controller/ControllerService";
import {browserBridgeClient} from "../module/BrowserBridgeClient";
import {Location} from "react-360-web";
import {globalMove} from "./GlobalMove";

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
    processHand(id: string, handId: number, data: ControllerState, delta: bolean) {
        if (!this.knownHandIds[id]) {
            this.knownHandIds[id] = {};
        }
        if (!this.knownHandIds[id][handId]) {
            this.knownHandIds[id][handId] = true;
            console.log("new hand");
            let loc3 = new Location([0, 0, 0]);
            if (delta) {
                globalMove.locations.push(loc3);
            }
            this.r360.renderToLocation(
                this.r360.createRoot("ParticipantHand", {
                    id: id, handId: handId, startVisible: true
                }),
                loc3
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