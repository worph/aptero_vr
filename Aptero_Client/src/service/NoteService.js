import {Surface, Location} from "react-360-web";
import EventEmitter from "eventemitter3";
import {convertEulerToQuaternion} from "../common/MathUtil";
import * as d3 from "d3-octree";
import {browserBridgeClient} from "../module/BrowserBridgeClient";
import {SpeechToTextService} from "./SpeechToTextService";

export interface Note3dData {
    id: string;
    x: number;
    y: number;
    z: number;
    location: Location;
    root: any;
}

export interface NoteDTOData {
    hand: number;
    id: string;
    x: number;
    y: number;
    z: number;
    rx: number;
    ry: number;
    rz: number;
    origin: string;
}

export class NoteService {
    eventEmitter = new EventEmitter();
    octree = null;

    nextNoteId: number = 0;
    lastNoteAdded = new Date().getTime();
    noteData: { [id: string]: Note3dData } = {};
    selectedNoteData: { [id: string]: Note3dData } = {};
    speechToTextService: SpeechToTextService = new SpeechToTextService();
    owner: string;

    locations = [];

    deltaX = 0;
    deltaY = 0;
    deltaZ = 0;

    applyDelta(x,y,z){
        this.locations.forEach(value => {
            value.setWorldPosition(value.worldPosition[0]+x,value.worldPosition[1]+y,value.worldPosition[2]+z);
        });
        this.deltaX+=x;
        this.deltaY+=y;
        this.deltaZ+=z;
    }

    recording = "false";

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
        browserBridgeClient.onEvent("startEditText", data => {
            //this.startEdit();
        });
        browserBridgeClient.onEvent("stopEditText", data => {
            this.stopEdit();
        });
        this.speechToTextService.start();
    }

    startEdit(id){
        this.recording = "true";
        this.changeText(this.owner, id, "Speak and click again on the note when finished.");
        this.speechToTextService.startRecording();
    }

    startOrStopEdit(owner: string, hand: number, x: number, y: number, z: number, givenRadius: number){
        let id = this.getNearestNoteMultiRadius(owner,hand,x,y,z,givenRadius);
        if(this.recording==="true"){
            this.stopEdit(id);
        }else if(this.recording==="false"){
            this.startEdit(id);
            setTimeout(() => {
                if (this.recording==="true") {
                    this.stopEdit(id);
                }
            }, 14000);//14s max input
        }
    }

    stopEdit(id){
        this.recording="processing";
        this.changeText(this.owner, id, "processing...");
        this.speechToTextService.stopRecordingAndGetText().then(text => {
            this.recording="false";
            this.changeText(this.owner, id, text);
        }).catch(error => {
            console.error(error);
            this.recording="false";
            this.changeText(this.owner, id, "server error please try again");
        });
    }

    onAdded(callback: (data: NoteDTOData)=>void): ()=>void {
        this.eventEmitter.on("note_added", callback);
        return () => {
            this.eventEmitter.off("note_added", callback);
        }
    }

    onSelect(callback: (data: { id: string, origin: string, hand: number })=>void): ()=>void {
        this.eventEmitter.on("note_selected", callback);
        return () => {
            this.eventEmitter.off("note_selected", callback);
        }
    }

    onDeselect(callback: (data: { id: string, origin: string, hand: number })=>void): ()=>void {
        this.eventEmitter.on("note_deselected", callback);
        return () => {
            this.eventEmitter.off("note_deselected", callback);
        }
    }

    onChangeText(callback: (data: { id: string, text: string, origin: string })=>void): ()=>void {
        this.eventEmitter.on("note_text", callback);
        return () => {
            this.eventEmitter.off("note_text", callback);
        }
    }

    createId(): string {
        this.nextNoteId++;
        return this.owner + this.nextNoteId;
    }

    createNoteAt(owner: string, hand: number, x: number, y: number, z: number, rx: number, ry: number, rz: number, checkTime: boolean = true, id: string = null) {
        if (checkTime && (new Date().getTime() - this.lastNoteAdded) <= 1000) {
            return;
        } else {
            this.lastNoteAdded = new Date().getTime();
        }
        let noteid = id ? id : this.createId();
        let quatRot = convertEulerToQuaternion([rx, ry, rz]);
        let root = this.r360.createRoot('Note', {
            id: noteid, position: {x: x, y: y, z: z, rx: rx, ry: ry, rz: rz}
        });
        let location = new Location([x+this.deltaX, y+this.deltaY, z+this.deltaZ], quatRot);
        this.locations.push(location);
        this.r360.renderToLocation(root, location);
        location.setWorldPosition(x+this.deltaX, y+this.deltaY, z+this.deltaZ);
        location.setWorldRotation(quatRot[0], quatRot[1], quatRot[2], quatRot[3]);
        let noteData = {id: noteid, location: location, root: root, x: x, y: y, z: z};
        this.noteData[noteid] = noteData;
        this.selectNote(owner, hand,noteid);
        this.deselectOwnedNote(owner, hand);//initialise in deselectedMode

        let dto: NoteDTOData = {
            id: noteid,
            hand: hand,
            x: x, y: y, z: z, rx: rx, ry: ry, rz: rz,
            origin: owner,
        };
        this.eventEmitter.emit("note_added", dto);
    }

    selectOrCreateNoteAt(owner: string, hand: number, x: number, y: number, z: number, rx: number, ry: number, rz: number, radius: number, checkTime: boolean = true): void {
        if (checkTime && (new Date().getTime() - this.lastNoteAdded) <= 1000) {
            return;
        } else {
            this.lastNoteAdded = new Date().getTime();
        }
        let deselected = this.deselectOwnedNote(owner, hand);
        if (!deselected) {
            if (this.selectNearestNoteMultiRadius(owner, hand, x, y, z, radius) === "-1") {
                this.createNoteAt(owner, hand, x, y, z, rx, ry, rz, false);
            }
        }
    }

    getNearestNoteMultiRadius(owner: string, hand: number, x: number, y: number, z: number, givenRadius: number): string {
        for(let radius = 0.02;radius<=givenRadius;radius*=2) {
            let res: Note3dData = this.octree.find(x, y, z, radius);
            if(res){
                return res.id;
            }
        }
        return "-1"
    }

    selectNearestNoteMultiRadius(owner: string, hand: number, x: number, y: number, z: number, givenRadius: number): string {
        for(let radius = 0.02;radius<=givenRadius;radius*=2) {
            let res: Note3dData = this.octree.find(x, y, z, radius);
            if(res){
                return this.selectNote(owner,hand,res.id);
            }
        }
        return "-1"
    }

    selectNearestNote(owner: string, hand: number, x: number, y: number, z: number, radius: number): string {
        let res: Note3dData = this.octree.find(x, y, z, radius);
        if (res) {
            this.selectNote(owner,hand,res.id);
        } else {
            return "-1";
        }
    }

    selectNote(owner: string, hand: number,id:string){
        let res = this.noteData[id];
        console.log("note selected : " + owner + " " + res.id);
        this.eventEmitter.emit("note_selected", {id: res.id, origin: owner,hand:hand});
        this.selectedNoteData[this.toSelectId(owner, hand)] = res;
        this.octree.remove(res);
        return res.id;
    }

    deselectOwnedNote(owner: string, hand: number): boolean {
        let noteData: Note3dData = this.selectedNoteData[this.toSelectId(owner, hand)];
        if (noteData) {
            console.log("note deselected : " + owner + " " + noteData.id);
            this.eventEmitter.emit("note_deselected", {id: noteData.id, origin: owner,hand:hand});
            delete this.selectedNoteData[this.toSelectId(owner, hand)];
            this.octree.add(noteData);
            return true;
        } else {
            return false;
        }
    }

    toSelectId(owner: string, hand: number): string {
        return owner + "-" + hand;
    }

    moveSelectedNote(owner: string, hand: number, x: number, y: number, z: number, eulerRotation,delta:boolean) {
        let noteData: Note3dData = this.selectedNoteData[this.toSelectId(owner, hand)];
        if (noteData) {
            let rotQuat = convertEulerToQuaternion(eulerRotation);
            let location = noteData.location;
            location.setWorldPosition(x+(delta?this.deltaX:0), y+(delta?this.deltaY:0), z+(delta?this.deltaZ:0));
            location.setWorldRotation(rotQuat[0], rotQuat[1], rotQuat[2], rotQuat[3]);
        }
    }

    changeText(owner: string, id: string, text: string) {
        this.eventEmitter.emit("note_text", {id: id, text: text, origin: owner});
        browserBridgeClient.emit("changeText", {
            id: id, text: text,
        });
    }

}