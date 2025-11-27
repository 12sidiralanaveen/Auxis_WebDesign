import React from 'react';

interface WaveformProps {
  isRecording: boolean;
}

const Waveform: React.FC<WaveformProps> = ({ isRecording }) => {
  return (
    <div className="flex items-center justify-center gap-1 h-12 w-full max-w-[200px]">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`w-2 bg-indigo-500 rounded-full transition-all duration-300 ${
            isRecording ? 'animate-pulse' : 'h-2'
          }`}
          style={{
            height: isRecording ? `${Math.random() * 24 + 16}px` : '4px',
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.6s'
          }}
        />
      ))}
    </div>
  );
};

export default Waveform;