// This file contains the boilerplate to execute your React app.
// If you want to modify your application's content, start in "index.ts"

import {BrowserBridgeNativeModule} from "./src/module/BrowserBridgeClient";

require("babel-core/register");
require("babel-polyfill");

import {ReactInstance} from 'react-360-web';
import {ApteroLogic} from "./src/ApteroLogic";

function init(bundle, parent) {
    let apteroLogic = new ApteroLogic();
    const r360 = new ReactInstance(bundle, parent, {
        // Add custom options here
        fullScreen: true,
        assetRoot: 'static_assets/',
        // Add custom options here
        // Register custom modules at init time
        frame: ()=>{
            apteroLogic.update(r360);
        },
        nativeModules: [
            ctx => {
                let bridgeModule = new BrowserBridgeNativeModule(ctx);
                return bridgeModule;
            },
        ]
    });
    apteroLogic.setReact360(r360);
}

window.React360 = {init};
