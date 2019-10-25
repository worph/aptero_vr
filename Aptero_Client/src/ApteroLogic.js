import {Paint3dDrawService} from "./service/Paint3dDrawService";
import {PeerjsService} from "./service/PeerjsService";
import {controllerService} from "./controller/ControllerService";
import KeyboardCameraController from "./controller/KeyboardCameraController";
import {NoteService} from "./service/NoteService";
import {NetworkLogic} from "./NetworkLogic";
import {LocalLogic} from "./LocalLogic";

export class ApteroLogic {
    bridgeModule;
    colorModule;
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
        this.r360.renderToLocation(
            this.r360.createRoot("Points", {}),
            this.r360.getDefaultLocation()
        );
        this.paint3d = new Paint3dDrawService();
        this.noteService = new NoteService(this.r360);
        this.localLogic = new LocalLogic(this.paint3d,this.noteService,this.bridgeModule,this.colorModule,this.r360);
        this.networkLogic = new NetworkLogic(this.paint3d,this.noteService,this.bridgeModule,this.colorModule,this.r360);
        this.networkLogic.setupNetwork().then(value => {
            this.localLogic.ownerId = this.networkLogic.peerJsService.getMyPeerJsId();
        });
        /*
        * Create room environement and menu
         */

        this.r360.renderToSurface(this.r360.createRoot('HeadLockMenu360'), this.r360.getDefaultSurface());

        this.r360.renderToLocation(
            this.r360.createRoot('Room'),
            this.r360.getDefaultLocation(),
        );

        this.r360.renderToLocation(
            this.r360.createRoot('Env'),
            this.r360.getDefaultLocation(),
        );
        this.r360.compositor.setBackground(this.r360.getAssetURL('360WorldSun.jpg'));

        /*
        * Setup controlls
         */
        this.r360.controls.addCameraController(new KeyboardCameraController());
        controllerService.createMouseController(this.r360);

        /*
        Init state
         */

        this.noteService.createNoteAt(0, 0, 0, 0, 0, 0, false);
    }

    checkReady(){
        if(this.r360 && this.bridgeModule && this.colorModule){
            this.setup();
            this.ready = true;
            console.log("ready");
        }
    }

    setReact360(r360) {
        this.r360 = r360;
        this.checkReady();
    }

    setBridgeModule(bridgeModule) {
        this.bridgeModule = bridgeModule;
        this.checkReady();
    }

    setColorModule(colorModule) {
        this.colorModule = colorModule;
        this.checkReady();
    }
}