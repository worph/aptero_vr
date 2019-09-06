import {
    AppRegistry,
} from 'react-360';
import Hello360 from "./src/react/Hello360"
import Room from "./src/objects/Room";
import Menu360 from "./src/react/Menu360";
import Participant from "./src/objects/Participant";
import Env from "./src/objects/Env";

AppRegistry.registerComponent('Hello360', () => Hello360);
AppRegistry.registerComponent('Menu360', () => Menu360);
AppRegistry.registerComponent('Room', () => Room);
AppRegistry.registerComponent('Participant', () => Participant);
AppRegistry.registerComponent('Env', () => Env);
