import {Surface} from "react-360-web";

export class NoteService {

    nextNoteId = 0;

    constructor(r360) {
        this.r360 = r360;
    }

    createNoteAt(x, y, z,rx,ry,rz) {
        const notePanel = new Surface(100, 100, Surface.SurfaceShape.Flat);
        let root = this.r360.createRoot('Note', {
            id: this.nextNoteId, position: {x: x, y: y, z: z, rx: rx, ry: ry, rz: rz}
        });
        this.r360.renderToLocation(root, this.r360.getDefaultLocation());
        /*this.r360.renderToSurface(this.r360.createRoot('Note',{
            id: this.nextNoteId, position:[x,y,z]
        }), notePanel,"note"+this.nextNoteId);*/
        this.nextNoteId++;
    }

}