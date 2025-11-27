import React, { useState, useRef } from 'react';
import { Mic, Send, Linkedin, Mail, ArrowRight, Zap, CheckCircle2, MessageSquareText } from 'lucide-react';
import { DraftMode, ProcessingState, RefinedResponse } from './types';
import { processAudioDraft } from './services/geminiService';
import Recorder from './components/Recorder';
import ResultDisplay from './components/ResultDisplay';
import ExplainerAnimation from './components/ExplainerAnimation';
import GmailComposeAnimation from './components/GmailComposeAnimation';

// Helper to convert Blob to Base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

function App() {
  const [mode, setMode] = useState<DraftMode>(DraftMode.EMAIL_REPLY);
  const [context, setContext] = useState<string>("");
  const [demoType, setDemoType] = useState<'linkedin' | 'gmail'>('linkedin');
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isRecording: false,
    isProcessing: false,
    error: null,
    result: null,
  });

  const demoSectionRef = useRef<HTMLDivElement>(null);

  const scrollToDemo = () => {
    demoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRecordingComplete = async (audioBlob: Blob) => {
    setProcessingState(prev => ({ ...prev, isProcessing: true, error: null }));
    
    try {
      const base64Audio = await blobToBase64(audioBlob);
      const result = await processAudioDraft(base64Audio, mode, context, audioBlob.type);
      setProcessingState(prev => ({ ...prev, isProcessing: false, result }));
    } catch (error) {
      console.error(error);
      setProcessingState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: "Failed to process audio. Please try again." 
      }));
    }
  };

  const handleReset = () => {
    setProcessingState({
      isRecording: false,
      isProcessing: false,
      error: null,
      result: null
    });
    setContext("");
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      
      {/* Header / Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
               <Mic className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">AuxisAI</span>
          </div>
          <button 
            onClick={scrollToDemo}
            className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-800 transition-colors"
          >
            Try Demo
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="blob bg-indigo-200 w-96 h-96 rounded-full top-0 left-0 -translate-x-1/2 -translate-y-1/2 mix-blend-multiply"></div>
        <div className="blob bg-purple-200 w-96 h-96 rounded-full bottom-0 right-0 translate-x-1/3 translate-y-1/3 mix-blend-multiply animation-delay-2000"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-semibold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Zap className="w-4 h-4 fill-current" />
            <span>Productivity Supercharged</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Draft emails <span className="gradient-text">with your voice.</span> <br />
            Context aware, <br />
            <span className="gradient-text">stress free.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            AuxisAI analyzes your speech and context to instantly generate well-crafted emails and LinkedIn posts. Communicate 3x faster than typing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <button 
              onClick={scrollToDemo}
              className="px-8 py-4 bg-indigo-600 text-white rounded-full font-semibold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30 flex items-center gap-2 group"
            >
              Start Drafting Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a href="#video-demo" className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-semibold text-lg hover:bg-slate-50 transition-colors">
              Watch Demo
            </a>
          </div>
        </div>
      </section>

      {/* Video Explainer Section */}
      <section id="video-demo" className="py-20 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-4">See AuxisAI in Action</h2>
            <p className="text-slate-600 text-center max-w-2xl mb-8">
              Watch how quickly you can draft messages. Just speak your intent, and let our AI handle the professional phrasing.
            </p>

            {/* Toggle Switch */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-slate-200 shadow-sm mb-8">
               <button 
                 onClick={() => setDemoType('linkedin')}
                 className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                   demoType === 'linkedin' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                 }`}
               >
                 <Linkedin className="w-4 h-4" /> LinkedIn
               </button>
               <button 
                 onClick={() => setDemoType('gmail')}
                 className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                   demoType === 'gmail' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                 }`}
               >
                 <Mail className="w-4 h-4" /> Gmail
               </button>
            </div>
          </div>
          
          <div className="transition-all duration-500 ease-in-out">
             {demoType === 'linkedin' ? <ExplainerAnimation /> : <GmailComposeAnimation />}
          </div>

          <div className="text-center mt-8">
             <p className="text-sm font-medium text-slate-500 italic">“AuxisAI — Communicate smarter, faster, stress-free.”</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                <MessageSquareText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Speak Naturally</h3>
              <p className="text-slate-600">Don't worry about "umms" or "ahhs". Speak as you think, and AuxisAI captures the intent perfectly.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6 text-purple-600">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Polish</h3>
              <p className="text-slate-600">Our Gemini-powered engine refines tone, fixes grammar, and structures your message professionally.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6 text-green-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Context Aware</h3>
              <p className="text-slate-600">Paste the email you're replying to. AuxisAI reads it and drafts a relevant, polite response automatically.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section ref={demoSectionRef} className="py-24 px-6 relative bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Try AuxisAI Live</h2>
            <p className="text-slate-600">Select a mode, provide context (optional), and hit record.</p>
          </div>

          {!processingState.result ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Controls */}
              <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 md:items-center justify-between max-w-2xl mx-auto">
                 <div className="flex p-1 bg-slate-100 rounded-xl">
                   {Object.values(DraftMode).map((m) => (
                     <button
                       key={m}
                       onClick={() => setMode(m)}
                       className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                         mode === m 
                           ? 'bg-white text-indigo-600 shadow-sm' 
                           : 'text-slate-500 hover:text-slate-700'
                       }`}
                     >
                       {m}
                     </button>
                   ))}
                 </div>
              </div>

              {/* Context Input */}
              <div className="max-w-2xl mx-auto">
                <label className="block text-sm font-medium text-slate-700 mb-2 ml-1">
                  Context (Optional)
                </label>
                <textarea
                  placeholder={
                    mode === DraftMode.EMAIL_REPLY 
                      ? "Paste the email you are replying to here..." 
                      : mode === DraftMode.LINKEDIN_POST 
                        ? "What is the topic? (e.g., 'Just finished a React workshop')"
                        : "Who are you emailing and why?"
                  }
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm min-h-[100px]"
                />
              </div>

              {/* Recorder */}
              <Recorder 
                onRecordingComplete={handleRecordingComplete} 
                isProcessing={processingState.isProcessing} 
              />
              
              {processingState.error && (
                <div className="text-red-500 text-center text-sm font-medium p-4 bg-red-50 rounded-lg max-w-md mx-auto">
                  {processingState.error}
                </div>
              )}

            </div>
          ) : (
            <ResultDisplay result={processingState.result} onReset={handleReset} />
          )}

        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-slate-400 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
            <Mic className="w-5 h-5 text-indigo-500" />
            <span className="font-bold text-white text-lg">AuxisAI</span>
        </div>
        <p className="text-sm">© {new Date().getFullYear()} AuxisAI. Communicate smarter, faster, stress-free.</p>
      </footer>
    </div>
  );
}

export default App;