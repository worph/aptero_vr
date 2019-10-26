import {
    AppRegistry,
} from 'react-360';
import Room from "./src/objects/Room";
import ParticipantHead from "./src/objects/ParticipantHead";
import Env from "./src/objects/Env";
import ParticipantHand from "./src/objects/ParticipantHand";
import Point from "./src/objects/Point";
import Points from "./src/objects/Points";
import {browserBridgeIndex, registerCallableModule} from "./src/module/BrowserBridgeIndex";
import HeadLockMenu360 from "./src/react/HeadLockMenu360";
import Note from "./src/objects/Note";

AppRegistry.registerComponent('Room', () => Room);
AppRegistry.registerComponent('ParticipantHead', () => ParticipantHead);
AppRegistry.registerComponent('ParticipantHand', () => ParticipantHand);
AppRegistry.registerComponent('Point', () => Point);
AppRegistry.registerComponent('Points', () => Points);
AppRegistry.registerComponent('HeadLockMenu360', () => HeadLockMenu360);
AppRegistry.registerComponent('Env', () => Env);
AppRegistry.registerComponent('Note', ()=> Note);

registerCallableModule();

browserBridgeIndex.emit("test",{test:1});