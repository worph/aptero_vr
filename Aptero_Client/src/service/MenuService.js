import {MODE_DRAW, RED} from "../common/Color";
import {browserBridgeClient} from "../module/BrowserBridgeClient";

export class MenuService {

    color = RED;
    mode = MODE_DRAW;

    constructor(){
        browserBridgeClient.onEvent("colorChange",data => {
            this.setColor(data);
        })
        browserBridgeClient.onEvent("modeChange",data => {
            this.setMode(data);
        })
    }

    getColor(){
        return this.color;
    }

    getMode(){
        return this.mode;
    }

    setColor(color:string){
        this.color = color;
    }

    setMode(mode:string){
        this.mode = mode;
    }

}