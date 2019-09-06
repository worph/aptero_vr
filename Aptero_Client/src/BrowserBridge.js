import BatchedBridge from 'react-native/Libraries/BatchedBridge/BatchedBridge';

//https://stackoverflow.com/questions/51745727/is-it-possible-to-call-a-react-360-method-from-a-native-module?rq=1
class BrowserBridge {
    constructor() {
        this._subscribers = {};
    }

    onEvent(eventName: string, handler: (data: any)=>void) {
        if (!this._subscribers[eventName]) {
            this._subscribers[eventName] = {};
        }
        let handlers = this._subscribers[eventName];
        const key = String(Math.random());
        handlers[key] = handler;
        return () => {
            delete handlers[key];
        };
    }

    notifyEvent(eventName, eventData) {
        let handlers = this._subscribers[eventName];
        Object.keys(handlers).forEach(key => {
            handlers[key](eventData);
        });
    }
}

export const browserBridge = new BrowserBridge();
BatchedBridge.registerCallableModule(BrowserBridge.name, browserBridge);