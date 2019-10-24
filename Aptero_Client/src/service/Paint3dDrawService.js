import * as d3 from 'd3-octree'
import EventEmitter from "eventemitter3";

export class Paint3dDrawService{
    eventEmitter = new EventEmitter();
    octree = null;
    nextUniqueId = 0;

    constructor(){
        this.octree = d3.octree();
        this.octree.x((d)=> {return d.x});
        this.octree.y((d)=> {return d.y});
        this.octree.z((d)=> {return d.z});
    }

    getNextUniqueId():string{
        this.nextUniqueId++;
        return ""+this.nextUniqueId;
    }

    onPointAdded(callback:(data:any)=>void):()=>void{
        this.eventEmitter.on("point_added",callback);
        return ()=>{
            this.eventEmitter.off("point_added",callback);
        }
    }

    onPointRemoved(callback:(x:number,y:number,z:number,radius:number,data:any)=>void):()=>void{
        this.eventEmitter.on("point_removed",callback);
        return ()=>{
            this.eventEmitter.off("point_removed",callback);
        }
    }

    addPointIfNotPresent(x:number,y:number,z:number,radius:number,data:any):void{
        if(!this.octree.find(x, y, z, radius)){
            if(data.id>=this.nextUniqueId){
                this.nextUniqueId = data.id+1;
            }
            let pointData = {
                id : data.id?data.id:this.getNextUniqueId(),
                x:x,
                y:y,
                z:z,
                ...data,
            };
            this.octree.add(pointData);
            this.eventEmitter.emit("point_added",pointData);
        }
    }

    removePointNear(x:number,y:number,z:number,radius:number):void{
        while(this.octree.find(x, y, z, radius)){
            let pointData = this.octree.find(x, y, z, radius);
            this.octree.remove(pointData);
            this.eventEmitter.emit("point_removed",pointData);
        }
    }

    getAll():any[]{
        return this.octree.data();
    }

    clearAll():void{
        this.removePointNear(0,0,0,undefined);
    }

}