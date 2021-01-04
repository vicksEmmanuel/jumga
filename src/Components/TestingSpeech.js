import React, { useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const TestingSpeech  = () => {
    const { transcript, resetTranscript, listening } = useSpeechRecognition()
    
    useEffect(async () => {
        if (!listening) {
            resetTranscript();
        }
    }, [listening])

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        console.log("Does not support");
        return null
    }
    return (
        <div>
            <button onClick={() => { SpeechRecognition.startListening({ continuous: true})}}>Start</button>
            <button onClick={SpeechRecognition.stopListening}>Stop</button>
            <button onClick={resetTranscript}>Reset</button>
            <p>{transcript}</p>
        </div>
    )
}

export default TestingSpeech;