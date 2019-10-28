

export class GlobalMove{
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
}

export const globalMove = new GlobalMove();