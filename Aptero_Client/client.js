// This file contains the boilerplate to execute your React app.
// If you want to modify your application's content, start in "index.ts"

import {BrowserBridgeNativeModule} from "./src/module/BrowserBridge";

require("babel-core/register");
require("babel-polyfill");

import {ReactInstance} from 'react-360-web';
import {ColorModule} from "./src/module/ColorModule";
import {ApteroLogic} from "./src/ApteroLogic";

function init(bundle, parent) {
    let netLogic = new ApteroLogic();
    const r360 = new ReactInstance(bundle, parent, {
        // Add custom options here
        fullScreen: true,
        assetRoot: 'static_assets/',
        // Register custom modules at init time
        frame: ()=>{
            netLogic.update(r360);
        },
        nativeModules: [
            ctx => {
                netLogic.bridgeModule = new BrowserBridgeNativeModule(ctx);
                return netLogic.bridgeModule;
            },
            ctx => {
                netLogic.colorModule = new ColorModule(ctx);
                return netLogic.colorModule;
            }
        ]
    });
    netLogic.r360 = r360;
    netLogic.setupReact360(r360);
    netLogic.setupNetwork(r360);
}

window.React360 = {init};
