import Module from "react-360-web/js/Modules/Module";
import {MODE_DRAW, RED} from "../common/Color";

export class ColorModule extends Module {

    color = RED;
    mode = MODE_DRAW;

    constructor(ctx) {
        super('ColorModule');
        this._rnctx = ctx;
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