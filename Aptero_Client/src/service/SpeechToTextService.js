//import Recorder from 'recorder-js';
import axios from "axios";

export class SpeechToTextService {
    /* Note this is a free tier API used only for the demo you do not need to "hack it" it will only disable the feature for the demo if you exceed the free tier instead go to https://app.assemblyai.com/ and create an account */
    PUBLIC_API_KEY:string = "cb54ac82ff8848659e1b43b96a1d9353";
    /**/

    recorder;
    isRecording;
    blob;

    start() {
        /*const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.recorder = new Recorder(audioContext);
        this.isRecording = false;
        this.blob = null;
        navigator.mediaDevices.getUserMedia({audio: true})
            .then(stream => this.recorder.init(stream))
            .catch(err => console.log('Uh oh... unable to get stream...', err));*/
    }

    startRecording() {
        this.recorder.start()
            .then(() => this.isRecording = true);
    }

    translateLastRecordToText(){
        axios.post("https://api.assemblyai.com/v2/upload",this.blob).then(resp => {
            console.log(resp.data);
        })
    }

    stopRecording() {
        this.recorder.stop()
            .then(({blob, buffer}) => {
                this.blob = blob;
                // buffer is an AudioBuffer
            });
    }

}