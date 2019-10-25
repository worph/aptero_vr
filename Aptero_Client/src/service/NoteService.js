import {Surface, Location} from "react-360-web";
import EventEmitter from "eventemitter3";
import {convertEulerToQuaternion} from "../common/MathUtil";
import * as d3 from "d3-octree";

export interface Note3dData {
    id: number;
    x: number;
    y: number;
    z: number;
    location: Location;
    root: any;
}

export class NoteService {
    eventEmitter = new EventEmitter();
    octree = null;

    nextNoteId = 0;
    lastNoteAdded = new Date().getTime();
    noteData: { [id: number]: Note3dData } = {};
    selectedNoteData: { [id: number]: Note3dData } = {};

    constructor(r360) {
        this.r360 = r360;
        this.octree = d3.octree();
        this.octree.x((d) => {
            return d.x
        });
        this.octree.y((d) => {
            return d.y
        });
        this.octree.z((d) => {
            return d.z
        });
    }

    onAdded(callback: (id: number)=>void): ()=>void {
        this.eventEmitter.on("note_added", callback);
        return () => {
            this.eventEmitter.off("note_added", callback);
        }
    }

    onRemoved(callback: (id: number)=>void): ()=>void {
        this.eventEmitter.on("note_removed", callback);
        return () => {
            this.eventEmitter.off("note_removed", callback);
        }
    }

    createNoteAt(x, y, z, rx, ry, rz, checkTime: boolean = true) {
        let quatRot = convertEulerToQuaternion([rx, ry, rz]);
        if (checkTime && (new Date().getTime() - this.lastNoteAdded) <= 1000) {
            return;
        }else{
            this.lastNoteAdded = new Date().getTime();
        }
        let noteid = this.nextNoteId;
        this.nextNoteId++;
        let root = this.r360.createRoot('Note', {
            id: noteid, position: {x: x, y: y, z: z, rx: rx, ry: ry, rz: rz}
        });
        let location = new Location([x, y, z], quatRot);
        this.r360.renderToLocation(root, location);
        location.setWorldPosition(x, y, z);
        location.setWorldRotation(quatRot[0], quatRot[1], quatRot[2], quatRot[3]);
        let noteData = {id: noteid, location: location, root: root, x: x, y: y, z: z};
        this.noteData[noteid] = noteData;
        this.deselectNote(noteid);//initialise in deselectedMode
        //this.r360.renderToLocation(root,this.r360.getDefaultLocation());
        /*const notePanel = new Surface(100, 100, Surface.SurfaceShape.Flat);
        this.r360.renderToSurface(root, notePanel,"note"+this.nextNoteId);*/
    }

    selectOrCreateNoteAt(owner: string, x: number, y: number, z: number, rx: number, ry: number, rz: number, radius: number, checkTime: boolean = true): void {
        if (checkTime && (new Date().getTime() - this.lastNoteAdded) <= 1000) {
            return;
        }else{
            this.lastNoteAdded = new Date().getTime();
        }
        let deselected = this.deselectOwnedNote(owner);
        if(!deselected) {
            if (this.selectNearestNote(owner, x, y, z, radius) === -1) {
                this.createNoteAt(x, y, z, rx, ry, rz, false);
            }
        }
    }

    selectNearestNote(owner: string, x: number, y: number, z: number, radius: number): number {
        let res: Note3dData = this.octree.find(x, y, z, radius);
        if (res) {
            console.log("note selected : "+owner+" "+res.id);
            this.selectedNoteData[owner] = res;
            this.octree.remove(res);
            return res.id;
        } else {
            return -1;
        }
    }

    deselectOwnedNote(owner: string): boolean {
        let noteData: Note3dData = this.selectedNoteData[owner];
        if(noteData) {
            console.log("note deselected : "+owner+" "+noteData.id);
            delete this.selectedNoteData[owner];
            this.deselectNote(noteData.id);
            return true;
        }else{
            return false;
        }
    }

    deselectNote(id: number): void {
        let noteData = this.noteData[id];
        this.octree.add(noteData);
    }

    moveSelectedNote(owner: string, x: number, y: number, z: number, eulerRotation) {
        let noteData: Note3dData = this.selectedNoteData[owner];
        if (noteData) {
            let rotQuat = convertEulerToQuaternion(eulerRotation);
            this.moveNote(noteData.id, x, y, z, rotQuat);
        }
    }

    moveNote(id: number, x: number, y: number, z: number, rotQuat: number[]) {
        let note = this.noteData[id];
        let location = note.location;
        location.setWorldPosition(x, y, z);
        location.setWorldRotation(rotQuat[0], rotQuat[1], rotQuat[2], rotQuat[3]);
    }

}