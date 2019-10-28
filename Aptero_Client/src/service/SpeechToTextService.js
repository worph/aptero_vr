import axios from "axios";
import {Recorder as RecorderJs} from 'recorder-js';
import Recorder from './Recorder';

export class SpeechToTextServiceAptero {
    host:string;
    constructor(){
        //this.host = window.location.href.startsWith("https://") ? "https://meeting.aptero.co/stt" : "http://127.0.0.1:6768";//TODO add parameters
        this.host = "https://meeting.aptero.co/stt";//TODO add parameters
    }


    arrayBufferToBase64( buffer ) {
        let binary = '';
        let bytes = new Uint8Array( buffer.buffer );
        let len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
        }
        return window.btoa( binary );
    }

    async blobToBase64(blob){
        return await new Promise(resolve => {
            let reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function() {
                let base64data = reader.result;
                base64data = base64data.substr(base64data.indexOf(',')+1);
                resolve(base64data);
            }
        })
    }

    async translateLastRecordToText(blob): Promise<string> {
        let base64Audio = await this.blobToBase64(blob);
        let resp = await axios.post(this.host+"/stt", {audio:base64Audio}, {});
        return resp.data.text;
    }

}


export class Wav2Recorder{

    recorder;
    blob;

    start() {
        this.recorder = new Recorder({
            sampleBits: 16,         // 采样位数，支持 8 或 16，默认是16
            sampleRate: 16000,      // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
            numChannels: 1,         // 声道，支持 1 或 2， 默认是1
        });
    }

    startRecording() {
        this.recorder.start();
    }

    async stopRecording() {
        this.recorder.stop();
        this.blob = this.recorder.getWAVBlob();
        return "ok";
    }

    getBlob(){
        return this.blob;
    }
}


export class WavRecorder{

    recorder;
    isRecording;
    blob;
    buffer;

    start() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        let recorder = new RecorderJs(audioContext);
        this.isRecording = false;
        this.blob = null;
        navigator.mediaDevices.getUserMedia({audio: true})
            .then(stream => recorder.init(stream))
            .catch(err => console.error('unable to get stream...', err));
        this.recorder = recorder;
    }

    startRecording() {
        this.recorder.start()
            .then(() => this.isRecording = true);
    }

    async stopRecording() {
        return this.recorder.stop()
            .then(({blob, buffer}) => {
                this.blob = blob;
                this.buffer = buffer[0];
                console.log(blob,buffer);
                this.isRecording = false;
                // buffer is an AudioBuffer
            }).catch(error => {
                console.error(error)
            });
    }

    getBlob(){
        return this.blob;
    }
    getBuffer(){
        return this.buffer;
    }
}

export class SpeechToTextService {

    recorder;
    sptTranslator;

    start() {
        this.recorder = new Wav2Recorder();
        this.recorder.start();
        this.sptTranslator = new SpeechToTextServiceAptero();
    }

    startRecording() {
        this.recorder.startRecording();
    }

    async stopRecording() {
        return this.recorder.stopRecording();
    }

    async stopRecordingAndGetText(): Promise<string> {
        await this.stopRecording();
        return await this.sptTranslator.translateLastRecordToText(this.recorder.getBlob());
    }

}