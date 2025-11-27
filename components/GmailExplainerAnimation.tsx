import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Paperclip, 
  MoreVertical, 
  X,
  Star,
  BrainCircuit,
  Sparkles,
  Zap,
  MousePointer2,
  Reply,
  Printer,
  ExternalLink,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  Smile
} from 'lucide-react';

const GmailExplainerAnimation: React.FC = () => {
  const [phase, setPhase] = useState(0);
  const [voiceText, setVoiceText] = useState("");
  const [finalText, setFinalText] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Animation Sequence
  useEffect(() => {
    let isCancelled = false;

    const runAnimation = async () => {
      while (!isCancelled) {
        // Reset
        setPhase(0);
        setVoiceText("");
        setFinalText("");
        // No scrolling needed anymore
        await new Promise(r => setTimeout(r, 1500));

        // 1. Move Cursor
        setPhase(1);
        await new Promise(r => setTimeout(r, 800));

        // 2. Click Mic
        setPhase(2);
        await new Promise(r => setTimeout(r, 300));

        // 3. Voice Popup & Typing
        setPhase(3); // Show Voice Popup
        const spoken = "Reply telling James I'm on it and will send the draft by 10 AM";
        for (let i = 0; i <= spoken.length; i++) {
          if (isCancelled) return;
          setVoiceText(spoken.slice(0, i));
          await new Promise(r => setTimeout(r, 30)); 
        }
        await new Promise(r => setTimeout(r, 500));

        // 4. Context Popup (Analysis of previous msg)
        setPhase(4); 
        await new Promise(r => setTimeout(r, 2000));

        // 5. Collision (Merge)
        setPhase(5);
        await new Promise(r => setTimeout(r, 600));

        // 6. Result Popup (Show Generated Content)
        setPhase(6);
        await new Promise(r => setTimeout(r, 2000));

        // 7. Transfer to Input (Typing Effect)
        setPhase(7);
        const fullDraft = "Hi James,\n\nReceived. I'm finalizing the updates now and will share the draft by 10 AM tomorrow.\n\nBest,\nDavid";
        for (let i = 0; i <= fullDraft.length; i += 3) {
           if (isCancelled) return;
           setFinalText(fullDraft.slice(0, i));
           await new Promise(r => setTimeout(r, 10));
        }
        setFinalText(fullDraft);

        await new Promise(r => setTimeout(r, 5000));
      }
    };

    runAnimation();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto font-sans bg-white rounded-t-xl shadow-2xl overflow-hidden border border-slate-300 relative h-[480px] flex flex-col text-slate-900 text-sm">
      
      {/* ==================== POPUPS LAYER ==================== */}
      
      {/* 1. Voice Popup (Bottom Right) */}
      <div 
        className={`absolute z-30 w-56 bg-white/95 backdrop-blur rounded-xl shadow-xl border-l-4 border-pink-500 p-3 transition-all duration-700 ease-in-out
          ${phase >= 3 && phase < 5 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-90'}
          ${phase === 5 ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-50 opacity-0' : 'bottom-32 right-12'} 
        `}
      >
        <div className="flex items-center gap-2 text-pink-600 mb-1">
          <Mic className="w-3 h-3 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Voice Input</span>
        </div>
        <p className="text-xs text-slate-800 font-medium leading-snug">
          "{voiceText}"
        </p>
      </div>

      {/* 2. Context Popup (Top Right - near message) */}
      <div 
        className={`absolute z-30 w-56 bg-white/95 backdrop-blur rounded-xl shadow-xl border-l-4 border-blue-500 p-3 transition-all duration-700 ease-in-out
          ${phase >= 4 && phase < 5 ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-10 scale-90'}
          ${phase === 5 ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-50 opacity-0' : 'top-32 right-12'}
        `}
      >
        <div className="flex items-center gap-2 text-blue-600 mb-1">
          <BrainCircuit className="w-3 h-3" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Context Detected</span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
             <span className="text-[10px] text-slate-600">Topic: <strong className="text-slate-800">Q4 Roadmap</strong></span>
          </div>
          <div className="flex items-center gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
             <span className="text-[10px] text-slate-600">Deadline: <strong className="text-slate-800">Tomorrow Morning</strong></span>
          </div>
        </div>
      </div>

      {/* 3. Collision Flash */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none transition-all duration-300
         ${phase === 5 ? 'opacity-100 scale-150' : 'opacity-0 scale-0'}
      `}>
         <div className="relative">
            <Zap className="w-16 h-16 text-indigo-500 fill-current animate-ping opacity-20 absolute top-0 left-0" />
            <Zap className="w-16 h-16 text-indigo-600 fill-current animate-pulse relative z-10" />
         </div>
      </div>

      {/* 4. Result Popup (Center -> Fade out to text input) */}
      <div 
        className={`absolute z-30 bg-white rounded-xl shadow-2xl border border-slate-200 transition-all duration-700 ease-out origin-center overflow-hidden
          ${phase === 6 ? 'opacity-100 scale-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80' : 'opacity-0 scale-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10'}
          ${phase >= 7 ? 'opacity-0 translate-y-20 scale-90' : ''}
        `}
      >
         <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
         <div className="p-4">
            <div className="flex items-center justify-between mb-2">
               <div className="flex items-center gap-2">
                 <Sparkles className="w-3 h-3 text-indigo-600" />
                 <span className="text-xs font-bold text-slate-800">Refined Draft</span>
               </div>
               <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide">Ready</span>
            </div>
            
            <div className="text-xs leading-relaxed text-slate-700">
               <p>Hi James,</p>
               <p className="mt-1">Received. I'm finalizing the <span className="bg-yellow-100 px-1 rounded text-slate-900 font-medium">Q4 updates</span> now and will share the draft by <span className="bg-yellow-100 px-1 rounded text-slate-900 font-medium">10 AM tomorrow</span>.</p>
               <p className="mt-2">Best,<br/>David</p>
            </div>
         </div>
      </div>


      {/* ==================== UI LAYER ==================== */}

      {/* Gmail Header */}
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-3 w-full">
            <h2 className="text-lg font-normal text-slate-900 truncate">Urgent: Q4 Roadmap Review</h2>
            <span className="bg-slate-200 text-slate-600 text-[10px] px-1.5 py-0.5 rounded">Inbox</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 shrink-0">
              <Printer className="w-4 h-4 hover:text-slate-600" />
              <ExternalLink className="w-4 h-4 hover:text-slate-600" />
          </div>
      </div>

      {/* Email Area (Fixed, no scroll) */}
      <div ref={chatContainerRef} className="bg-white flex-1 overflow-hidden relative flex flex-col font-sans text-sm">
         
         {/* Sender Info */}
         <div className="flex items-start gap-3 p-3 shrink-0">
            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200" alt="James" className="w-10 h-10 rounded-full object-cover" />
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-900 text-sm">James Wilson <span className="font-normal text-slate-500 text-xs">&lt;james.w@cloudscale.com&gt;</span></h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>Tue, Oct 24, 4:12 PM (1 day ago)</span>
                        <div className="flex gap-1">
                             <Star className="w-4 h-4 text-slate-300 hover:text-yellow-400 cursor-pointer" />
                             <Reply className="w-4 h-4 text-slate-500" />
                             <MoreVertical className="w-4 h-4 text-slate-500" />
                        </div>
                    </div>
                </div>
                <div className="text-xs text-slate-500">to me, Team</div>
                
                {/* Email Body */}
                <div className={`mt-3 text-slate-800 leading-relaxed whitespace-pre-line relative transition-all duration-300 text-xs
                    ${phase >= 4 && phase < 6 ? 'bg-indigo-50/50 p-2 -ml-2 rounded-lg ring-1 ring-indigo-200' : ''}
                `}>
                    {phase >= 4 && phase < 6 && (
                         <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[9px] px-2 py-0.5 rounded-full font-bold animate-bounce shadow-md">ANALYZING</div>
                    )}
                    Hi Team,
                    <br/><br/>
                    We need to finalize the Q4 roadmap by EOD Friday to present to leadership next week.
                    Can everyone please send their section updates by <strong>tomorrow morning</strong> so I can compile everything?
                    <br/><br/>
                    Thanks, James
                </div>
            </div>
         </div>

         {/* Reply Area (Mimics open editor) - Fills remaining space */}
         <div className="mx-3 mt-1 mb-3 border border-slate-200 rounded-lg shadow-sm flex flex-col flex-1 relative transition-all duration-300"
              style={{ borderColor: phase === 7 ? '#818cf8' : '#e2e8f0' }}
         >
            {/* Header of Reply */}
            <div className="flex items-center gap-2 p-2 border-b border-slate-100 shrink-0">
                <Reply className="w-4 h-4 text-slate-500" />
                <span className="text-xs text-slate-500">James Wilson</span>
            </div>

            {/* Editor */}
            <div className={`flex-1 p-3 bg-white relative`}>
                 <textarea 
                    readOnly
                    className="w-full h-full resize-none outline-none border-none text-sm text-slate-800 font-sans"
                    value={finalText}
                />
                
                {/* Mic Button Positioned in Editor */}
                <div className="absolute top-1/2 right-4 -translate-y-1/2 flex items-center gap-2 z-20">
                     <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300
                        ${phase === 2 || phase === 3 ? 'bg-red-500 shadow-lg shadow-red-200 ring-4 ring-red-50 scale-110' : 'bg-white border border-slate-200 hover:bg-slate-50 shadow-sm'}
                     `}>
                        {phase === 2 || phase === 3 ? (
                           <div className="flex gap-0.5 items-end h-3">
                              <div className="w-0.5 bg-white h-full animate-[wave_0.5s_ease-in-out_infinite]"></div>
                              <div className="w-0.5 bg-white h-2/3 animate-[wave_0.5s_ease-in-out_infinite_0.1s]"></div>
                              <div className="w-0.5 bg-white h-full animate-[wave_0.5s_ease-in-out_infinite_0.2s]"></div>
                           </div>
                        ) : (
                           <Mic className="w-4 h-4 text-indigo-600" />
                        )}
                     </div>
                </div>

                {/* Cursor Animation */}
                {phase === 1 && (
                     <div className="absolute top-1/2 right-4 z-50 transition-transform duration-700 ease-in-out translate-x-[-12px] translate-y-[-4px]">
                         <MousePointer2 className="w-5 h-5 text-slate-900 fill-white drop-shadow-xl" />
                     </div>
                )}
            </div>

            {/* Bottom Toolbar */}
            <div className="p-2 flex items-center justify-between border-t border-slate-100 bg-slate-50 rounded-b-lg shrink-0">
                <div className="flex gap-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-xs font-bold transition-colors">Send</button>
                    <div className="flex items-center gap-3 px-2 border-l border-slate-300 ml-1 text-slate-500">
                        <Bold className="w-3.5 h-3.5" />
                        <Italic className="w-3.5 h-3.5" />
                        <Underline className="w-3.5 h-3.5" />
                        <AlignLeft className="w-3.5 h-3.5" />
                    </div>
                </div>
                <div className="flex items-center gap-3 text-slate-500 pr-2">
                    <Paperclip className="w-4 h-4 hover:text-slate-700" />
                    <Smile className="w-4 h-4 hover:text-slate-700" />
                    <MoreVertical className="w-4 h-4 hover:text-slate-700" />
                </div>
            </div>
         </div>
         
      </div>
      
    </div>
  );
};

export default GmailExplainerAnimation;