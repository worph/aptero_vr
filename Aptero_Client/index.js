import {
    AppRegistry,
} from 'react-360';
import ParticipantHead from "./src/objects/ParticipantHead";
import Env from "./src/objects/Env";
import ParticipantHand from "./src/objects/ParticipantHand";
import Point from "./src/objects/Point";
import Points from "./src/objects/Points";
import {browserBridgeIndex, registerCallableModule} from "./src/module/BrowserBridgeIndex";
import HeadLockMenu360 from "./src/react/HeadLockMenu360";
import Note from "./src/objects/Note";
import WhiteBoard from "./src/objects/WhiteBoard";
import RoomA from "./src/objects/RoomA";
import RoomB from "./src/objects/RoomB";

AppRegistry.registerComponent('RoomA', () => RoomA);
AppRegistry.registerComponent('RoomB', () => RoomB);
AppRegistry.registerComponent('ParticipantHead', () => ParticipantHead);
AppRegistry.registerComponent('ParticipantHand', () => ParticipantHand);
AppRegistry.registerComponent('Point', () => Point);
AppRegistry.registerComponent('Points', () => Points);
AppRegistry.registerComponent('HeadLockMenu360', () => HeadLockMenu360);
AppRegistry.registerComponent('Env', () => Env);
AppRegistry.registerComponent('Note', ()=> Note);
AppRegistry.registerComponent('WhiteBoard', ()=> WhiteBoard);


registerCallableModule();

browserBridgeIndex.emit("test",{test:1});