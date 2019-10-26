import Recorder from 'recorder-js';
const MicRecorder = require('mic-recorder-to-mp3');
import axios from "axios";

export class SpeechToTextService {
    /* Note this is a free tier API used only for the demo you do not need to "hack it" it will only disable the feature for the demo if you exceed the free tier instead go to https://assemblyai.com/ and create an account */
    PUBLIC_API_KEY: string = "cb54ac82ff8848659e1b43b96a1d9353";
    /**/

    recorder;
    isRecording;
    blob;

    start() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.recorder = new Recorder(audioContext);
        this.isRecording = false;
        this.blob = null;
        navigator.mediaDevices.getUserMedia({audio: true})
            .then(stream => this.recorder.init(stream))
            .catch(err => console.log('Uh oh... unable to get stream...', err));
        /*this.recorder = new MicRecorder({
            bitRate: 128
        });*/
    }

    startRecording() {
        this.recorder.start()
            .then(() => this.isRecording = true);
    }

    async stopRecording() {
        return this.recorder.stop()
            .then(({blob, buffer}) => {
                this.blob = blob;
                // buffer is an AudioBuffer
            }).catch(error => {
                console.error(error)
            });
        /*return this.recorder.stop()
            .getMp3().then(([buffer, blob]) => {
                this.blob = blob;
                const file = new File(buffer, 'me-at-thevoice.mp3', {
                    type: blob.type,
                    lastModified: Date.now()
                });

                const player = new Audio(URL.createObjectURL(file));
                player.play();
            });*/
    }

    async translateLastRecordToText(): Promise<string> {
        console.log("upload_blob",this.blob);
        let resp = await axios.post("https://api.assemblyai.com/v2/upload", this.blob, {
            headers: {
                authorization: this.PUBLIC_API_KEY
            }
        });
        console.log(resp.data);//{upload_url: "https://cdn.assemblyai.com/upload/d9eb3b18-0c31-409c-bbf0-537d22e6fe81"}
        let audioDataURL = resp.data.upload_url;
        let respTranscript = await axios.post("https://api.assemblyai.com/v2/transcript", {"audio_url": audioDataURL}, {
            headers: {
                authorization: this.PUBLIC_API_KEY,
                "content-type": "application/json"
            }
        });
        let transcriptId = respTranscript.data.id;
        await new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 200);
        });
        let i=0;
        console.log("pool_request");
        let respPool = {data: {status: "queued"}};
        //pool result 500ms
        while (respPool.data.status === "queued" || respPool.data.status === "processing") {
            console.log("pool_request-"+i);
            i++;
            respPool = await axios.get("https://api.assemblyai.com/v2/transcript/" + transcriptId, {headers: {authorization: this.PUBLIC_API_KEY,}});
            if(respPool.data.status === "queued" || respPool.data.status === "processing") {
                await new Promise(resolve => {
                    setTimeout(() => {
                        resolve();
                    }, 500);
                });
            }
        }
        console.log(respPool);
        if (respPool.data.status === "completed") {
            return respPool.data.text;
        } else {
            throw new Error("fail");
        }
    }

    async stopRecordingAndGetText(): Promise<string> {
        await this.stopRecording();
        return await this.translateLastRecordToText();
    }

}