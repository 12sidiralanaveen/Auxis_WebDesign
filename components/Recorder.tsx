import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import Waveform from './Waveform';

interface RecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  isProcessing: boolean;
}

const Recorder: React.FC<RecorderProps> = ({ onRecordingComplete, isProcessing }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please ensure permissions are granted.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-xl border border-indigo-50 w-full max-w-md mx-auto transition-all hover:shadow-2xl hover:border-indigo-100">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-semibold text-slate-700">Voice Input</h3>
        <p className="text-sm text-slate-500">
          {isRecording ? "Listening... Speak naturally." : "Tap microphone to start drafting"}
        </p>
      </div>

      <div className="h-16 flex items-center justify-center mb-6 w-full">
        {isRecording ? (
          <Waveform isRecording={isRecording} />
        ) : (
          <div className="h-1 bg-slate-100 w-32 rounded-full" />
        )}
      </div>

      <div className="relative">
        {isProcessing ? (
           <button disabled className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center cursor-not-allowed">
             <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
           </button>
        ) : isRecording ? (
          <button
            onClick={stopRecording}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all shadow-lg hover:shadow-red-200 ring-4 ring-red-50 animate-pulse"
          >
            <Square className="w-6 h-6 text-white fill-current" />
          </button>
        ) : (
          <button
            onClick={startRecording}
            className="w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center transition-all shadow-lg hover:shadow-indigo-200 ring-4 ring-indigo-50 group"
          >
            <Mic className="w-8 h-8 text-white transition-transform group-hover:scale-110" />
          </button>
        )}
      </div>
      
      {isRecording && (
        <div className="mt-4 text-sm font-medium text-red-500 font-mono">
          {formatTime(recordingTime)}
        </div>
      )}
    </div>
  );
};

export default Recorder;