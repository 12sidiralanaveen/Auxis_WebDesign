import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Image as ImageIcon, 
  Paperclip, 
  Smile, 
  MoreHorizontal, 
  X,
  Video,
  Star,
  BrainCircuit,
  Sparkles,
  Zap,
  MousePointer2,
  Maximize2
} from 'lucide-react';

const ExplainerAnimation: React.FC = () => {
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
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
        await new Promise(r => setTimeout(r, 1500));

        // 1. Move Cursor
        setPhase(1);
        await new Promise(r => setTimeout(r, 800));

        // 2. Click Mic
        setPhase(2);
        await new Promise(r => setTimeout(r, 300));

        // 3. Voice Popup & Typing
        setPhase(3); // Show Voice Popup
        const spoken = "Reply saying I'm interested and free for a call after 4pm";
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
        const fullDraft = "Hi Sarah, thanks for reaching out! I'm definitely interested in the Senior Data Scientist role.\n\nI'm available for a quick call anytime after 4 PM today.";
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
          ${phase === 5 ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-50 opacity-0' : 'bottom-20 right-4'} 
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
          ${phase === 5 ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-50 opacity-0' : 'top-40 right-6'}
        `}
      >
        <div className="flex items-center gap-2 text-blue-600 mb-1">
          <BrainCircuit className="w-3 h-3" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Context Detected</span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
             <span className="text-[10px] text-slate-600">Role: <strong className="text-slate-800">Sr. Data Scientist</strong></span>
          </div>
          <div className="flex items-center gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
             <span className="text-[10px] text-slate-600">Action: <strong className="text-slate-800">Call Request</strong></span>
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
               <p>Hi Sarah, thanks for reaching out! I'm definitely interested in the <span className="bg-yellow-100 px-1 rounded text-slate-900 font-medium">Senior Data Scientist role</span>.</p>
               <p className="mt-1">I'm available for a quick call <span className="bg-yellow-100 px-1 rounded text-slate-900 font-medium">anytime after 4 PM</span> today.</p>
            </div>
         </div>
      </div>


      {/* ==================== UI LAYER ==================== */}

      {/* Header */}
      <div className="bg-white px-3 py-1.5 border-b border-slate-200 flex justify-between items-center shadow-sm z-10 shrink-0 h-12">
        <div className="flex items-center gap-2 overflow-hidden">
            <div className="relative shrink-0">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200" alt="Sarah Jenkins" className="w-8 h-8 rounded-full object-cover border border-slate-100" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-600 border-2 border-white rounded-full"></div>
            </div>
            <div className="min-w-0">
                <h3 className="font-semibold text-slate-900 text-xs truncate">Sarah Jenkins</h3>
                <p className="text-[10px] text-slate-500 truncate">Senior Technical Recruiter at CloudScale • 1st</p>
            </div>
        </div>
        <div className="flex items-center gap-2 text-slate-500 shrink-0">
            <MoreHorizontal className="w-4 h-4 hover:text-slate-700 cursor-pointer" />
            <Video className="w-4 h-4 hover:text-slate-700 cursor-pointer" />
            <Star className="w-4 h-4 hover:text-slate-700 cursor-pointer" />
            <Maximize2 className="w-3 h-3 hover:text-slate-700 cursor-pointer" />
            <X className="w-4 h-4 hover:text-slate-700 cursor-pointer" />
        </div>
      </div>

      {/* Chat Area */}
      <div ref={chatContainerRef} className="bg-white flex-1 p-3 overflow-y-auto relative flex flex-col font-sans scroll-smooth text-xs">
         
         <div className="flex items-center justify-center my-4">
             <div className="h-px bg-slate-200 w-full"></div>
             <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest px-2 bg-white shrink-0">Yesterday</span>
             <div className="h-px bg-slate-200 w-full"></div>
         </div>

         {/* Msg 1: Me */}
         <div className="flex gap-2 flex-row-reverse mb-4">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200" alt="Me" className="w-8 h-8 rounded-full object-cover mt-1" />
            <div className="flex flex-col items-end max-w-[85%]">
                 <div className="flex items-center gap-1 mb-0.5">
                    <span className="text-[9px] text-slate-400">4:45 PM</span>
                    <span className="font-semibold text-[10px] text-slate-700">David Kim</span>
                 </div>
                 <div className="bg-[#f3f6f8] p-2.5 rounded-t-xl rounded-bl-xl text-xs text-slate-800 leading-relaxed shadow-sm">
                   Hi Sarah, thanks for accepting my connection request! I've been following CloudScale's work in AI for a while.
                </div>
            </div>
         </div>

         {/* Msg 2: Sarah */}
         <div className="flex gap-2 mb-4">
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200" alt="Sarah" className="w-8 h-8 rounded-full object-cover mt-1" />
            <div className="max-w-[85%]">
                <div className="flex items-baseline gap-1 mb-0.5">
                   <span className="font-semibold text-[10px] text-slate-900">Sarah Jenkins</span>
                   <span className="text-[9px] text-slate-400">5:12 PM</span>
                </div>
                <div className="bg-white border border-slate-200 p-2.5 rounded-t-xl rounded-br-xl shadow-sm text-xs text-slate-800 leading-relaxed">
                   Hi David! Great to connect. Your background in Node.js and React looks impressive.
                </div>
            </div>
         </div>

         <div className="flex items-center justify-center my-4">
             <div className="h-px bg-slate-200 w-full"></div>
             <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest px-2 bg-white shrink-0">Today</span>
             <div className="h-px bg-slate-200 w-full"></div>
         </div>

         {/* Msg 3: Sarah (Target) */}
         <div className="flex gap-2 mb-2">
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200" alt="Sarah" className="w-8 h-8 rounded-full object-cover mt-1" />
            <div className="max-w-[90%]">
                <div className="flex items-baseline gap-1 mb-0.5">
                   <span className="font-semibold text-[10px] text-slate-900">Sarah Jenkins</span>
                   <span className="text-[9px] text-slate-400">10:30 AM</span>
                </div>
                <div className={`bg-white border p-3 rounded-t-xl rounded-br-xl shadow-sm text-xs text-slate-800 leading-relaxed transition-all duration-500 relative
                   ${phase >= 4 && phase < 6 ? 'border-indigo-400 ring-2 ring-indigo-50 z-20 shadow-lg shadow-indigo-100' : 'border-slate-200'}
                `}>
                   {phase >= 4 && phase < 6 && (
                     <div className="absolute -top-3 -right-2 bg-indigo-600 text-white text-[9px] px-2 py-0.5 rounded-full font-bold animate-bounce shadow-md">ANALYZING CONTEXT</div>
                   )}
                   We actually just opened a <span className="font-semibold">Senior Data Scientist</span> role that seems like a perfect match for your skillset. 
                   <br /><br />
                   Would you be open to a quick 15-min chat this afternoon to discuss?
                </div>
            </div>
         </div>
      </div>

      {/* Input Area */}
      <div className="bg-white p-2 border-t border-slate-200 shrink-0 relative z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
          
          <div className={`bg-[#f3f6f8] rounded-xl border-2 transition-all duration-300 relative min-h-[80px]
              ${phase === 7 ? 'bg-indigo-50/20 border-indigo-200' : 'border-transparent'}
          `}>
              <textarea 
                readOnly
                className="w-full bg-transparent border-none outline-none resize-none text-[13px] text-slate-800 p-3 leading-relaxed placeholder-slate-500 font-sans h-full"
                placeholder="Write a message..."
                value={finalText}
              />
              
              {/* Mic Button */}
              <div className="absolute bottom-2 right-2 flex items-center gap-2">
                 <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300
                    ${phase === 2 || phase === 3 ? 'bg-red-500 shadow-lg shadow-red-200 ring-4 ring-red-50 scale-110' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'}
                 `}>
                    {phase === 2 || phase === 3 ? (
                       <div className="flex gap-0.5 items-end h-3">
                          <div className="w-0.5 bg-white h-full animate-[wave_0.5s_ease-in-out_infinite]"></div>
                          <div className="w-0.5 bg-white h-2/3 animate-[wave_0.5s_ease-in-out_infinite_0.1s]"></div>
                          <div className="w-0.5 bg-white h-full animate-[wave_0.5s_ease-in-out_infinite_0.2s]"></div>
                       </div>
                    ) : (
                       <Mic className="w-3.5 h-3.5 text-white" />
                    )}
                 </div>
              </div>

              {/* Cursor Animation */}
              {phase === 1 && (
                 <div className="absolute bottom-0 right-0 z-50 transition-transform duration-700 ease-in-out translate-x-[-12px] translate-y-[-12px]">
                     <MousePointer2 className="w-5 h-5 text-slate-900 fill-white drop-shadow-xl" />
                 </div>
              )}
          </div>

          <div className="flex justify-between items-center mt-2 px-1">
              <div className="flex gap-3 text-slate-500">
                  <ImageIcon className="w-4 h-4 hover:text-slate-700 cursor-pointer" />
                  <Paperclip className="w-4 h-4 hover:text-slate-700 cursor-pointer" />
                  <Smile className="w-4 h-4 hover:text-slate-700 cursor-pointer" />
              </div>
              <button 
                className={`px-4 py-1 rounded-full text-xs font-bold transition-all duration-300 
                    ${finalText.length > 5 ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md' : 'bg-slate-100 text-slate-400'}
                `}
              >
                  Send
              </button>
          </div>
      </div>
      
    </div>
  );
};

export default ExplainerAnimation;