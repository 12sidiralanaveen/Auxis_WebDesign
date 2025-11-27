import React from 'react';
import { RefinedResponse } from '../types';
import { Copy, Check, ArrowRight, Wand2, Clock } from 'lucide-react';

interface ResultDisplayProps {
  result: RefinedResponse;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onReset }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.refinedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-10 fade-in duration-500">
      
      {/* Metrics Banner */}
      <div className="flex items-center justify-between bg-green-50 border border-green-100 p-4 rounded-xl">
        <div className="flex items-center gap-2 text-green-700">
           <Clock className="w-5 h-5" />
           <span className="font-medium">Time Saved: {result.savedTime}</span>
        </div>
        <div className="flex items-center gap-2 text-green-700">
           <Wand2 className="w-5 h-5" />
           <span className="font-medium">Context Optimized</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Original Transcription */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Your Rough Draft</h4>
          <p className="text-slate-600 text-sm leading-relaxed italic">
            "{result.transcription}"
          </p>
        </div>

        {/* Tone Analysis */}
        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3">AI Tone Analysis</h4>
          <p className="text-indigo-900 text-sm leading-relaxed">
            {result.toneAnalysis}
          </p>
        </div>
      </div>

      {/* Final Result */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
            AuxisAI Refined Draft
          </h3>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <div className="prose prose-slate max-w-none">
          <textarea
            readOnly
            className="w-full h-48 p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-200 resize-none text-slate-800 text-base leading-relaxed"
            value={result.refinedContent}
          />
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium transition-colors"
        >
          Draft Another <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;