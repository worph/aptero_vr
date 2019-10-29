import {Paint3dDrawService} from "./service/Paint3dDrawService";
import {PeerjsService} from "./service/PeerjsService";
import {controllerService} from "./controller/ControllerService";
import KeyboardCameraController, {cameraControl} from "./controller/KeyboardCameraController";
import {NoteService} from "./service/NoteService";
import {NetworkLogic} from "./NetworkLogic";
import {LocalLogic} from "./LocalLogic";
import {Location, Surface} from "react-360-web";
import {convertEulerToQuaternion} from "./common/MathUtil";
import {globalMove} from "./service/GlobalMove";

export class ApteroLogic {
    r360;

    peerJsService: PeerjsService;
    noteService: NoteService;
    paint3d: Paint3dDrawService;
    localLogic: LocalLogic;
    networkLogic: NetworkLogic;

    ready = false;

    update() {
        if(this.ready) {
            this.localLogic.update();
        }
    }

    setup() {
        let loc1 = new Location([0,0,0]);
        globalMove.locations.push(loc1);
        this.r360.renderToLocation(
            this.r360.createRoot("Points", {}),
            loc1
        );
        this.paint3d = new Paint3dDrawService();
        this.noteService = new NoteService(this.r360);
        this.localLogic = new LocalLogic(this.paint3d,this.noteService,this.r360);
        this.networkLogic = new NetworkLogic(this.paint3d,this.noteService,this.r360);
        this.networkLogic.setupNetwork().then(value => {
            let peerjsId = this.networkLogic.peerJsService.getMyPeerJsId();
            this.localLogic.ownerId = peerjsId;
            this.noteService.owner = peerjsId;
        });
        /*
        * Create room environement and menu
         */

        const myCylinderSurface = new Surface(
            1000, /* width */
            600, /* height */
            Surface.SurfaceShape.Cylinder /* shape */
        );
        this.r360.renderToSurface(this.r360.createRoot('HeadLockMenu360'), myCylinderSurface);

        let loc = new Location([0,0,0]);
        globalMove.locations.push(loc);
        this.r360.renderToLocation(
            this.r360.createRoot('WhiteBoard'),
            loc
        );
        let quat = convertEulerToQuaternion([0,0,0]);
        loc.setWorldRotation(quat[0],quat[1],quat[2],quat[3]);
        loc.setWorldPosition(-2,1,3)

        let locA = new Location([0,0,0]);
        globalMove.locations.push(locA);
        this.r360.renderToLocation(
            this.r360.createRoot('RoomA'),
            locA,
        );

        let locB = new Location([0,0,0]);
        globalMove.locations.push(locB);
        this.r360.renderToLocation(
            this.r360.createRoot('RoomB'),
            locB,
        );

        let loc3 = new Location([0,0,0]);
        globalMove.locations.push(loc3);
        this.r360.renderToLocation(
            this.r360.createRoot('Env'),
            loc3,
        );

        /*
        * Setup controlls
         */
        let controllerBefore = this.r360.controls.cameraControllers;
        let newController = [new KeyboardCameraController()];
        newController.push(...controllerBefore);
        this.r360.controls.cameraControllers = newController;
        controllerService.createMouseController(this.r360);

        cameraControl.on("move_scene",(data:{move:number[]})=>{
            globalMove.applyDelta(data.move[0],data.move[1],data.move[2]);
            this.noteService.applyDelta(data.move[0],data.move[1],data.move[2]);
            controllerService.setAbsoluteDelta(globalMove.deltaX,globalMove.deltaY,globalMove.deltaZ);
            /*this.r360._cameraPosition[0]-=data.move[0];
            this.r360._cameraPosition[1]-=data.move[1];
            this.r360._cameraPosition[2]-=data.move[2];*/
        });

        /*
        Init state
         */

        this.r360.compositor.setBackground(this.r360.getAssetURL('360WorldSun.jpg'));
        this.noteService.createNoteAt(0, 0, 0, 0, 0, 0, false);
    }

    checkReady(){
        if(this.r360){
            this.setup();
            this.ready = true;
            console.log("ready");
        }
    }

    setReact360(r360) {
        this.r360 = r360;
        this.checkReady();
    }
}