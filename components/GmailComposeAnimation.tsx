import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Minus, 
  Maximize2, 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  List, 
  ListOrdered, 
  Indent, 
  Quote,
  Type, 
  Paperclip, 
  Link, 
  Smile, 
  HardDrive, 
  Image as ImageIcon, 
  Lock, 
  PenTool, 
  MoreVertical, 
  Trash2, 
  ChevronDown, 
  Undo2, 
  Redo2, 
  Mic, 
  Sparkles, 
  Zap, 
  MousePointer2 
} from 'lucide-react';

const GmailComposeAnimation: React.FC = () => {
  const [phase, setPhase] = useState(0);
  const [voiceText, setVoiceText] = useState("");
  const [finalText, setFinalText] = useState("");

  // Animation Sequence
  useEffect(() => {
    let isCancelled = false;

    const runAnimation = async () => {
      while (!isCancelled) {
        // Reset
        setPhase(0);
        setVoiceText("");
        setFinalText("");
        await new Promise(r => setTimeout(r, 1500));

        // 1. Move Cursor
        setPhase(1);
        await new Promise(r => setTimeout(r, 800));

        // 2. Click Mic
        setPhase(2);
        await new Promise(r => setTimeout(r, 300));

        // 3. Voice Popup & Typing
        setPhase(3); 
        const spoken = "Ask James to send over the budget breakdown for Q4 marketing before our meeting tomorrow at 10";
        for (let i = 0; i <= spoken.length; i++) {
          if (isCancelled) return;
          setVoiceText(spoken.slice(0, i));
          await new Promise(r => setTimeout(r, 30)); 
        }
        await new Promise(r => setTimeout(r, 500));

        // 5. Collision (Merge) -> Processing
        // We skip phase 4 (Context Analysis) as it's not needed for new emails
        setPhase(5);
        await new Promise(r => setTimeout(r, 600));

        // 6. Result Popup (Show Generated Content)
        setPhase(6);
        await new Promise(r => setTimeout(r, 2000));

        // 7. Transfer to Input (Typing Effect)
        setPhase(7);
        const fullDraft = "Hi James,\n\nCould you please send over the breakdown for the Q4 marketing budget? I'd like to review it before our meeting tomorrow at 10 AM.\n\nThanks,\nDavid";
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
    <div className="w-full max-w-xl mx-auto font-sans bg-white rounded-t-xl rounded-b-xl shadow-2xl overflow-hidden border border-slate-300 relative h-[480px] flex flex-col text-slate-900 text-sm">
      
      {/* ==================== POPUPS LAYER ==================== */}
      
      {/* 1. Voice Popup */}
      <div 
        className={`absolute z-30 w-64 bg-white/95 backdrop-blur rounded-xl shadow-xl border-l-4 border-pink-500 p-3 transition-all duration-700 ease-in-out
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

      {/* 2. Processing Flash (Replaces Collision) */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none transition-all duration-300
         ${phase === 5 ? 'opacity-100 scale-150' : 'opacity-0 scale-0'}
      `}>
         <div className="relative">
            <Zap className="w-16 h-16 text-indigo-500 fill-current animate-ping opacity-20 absolute top-0 left-0" />
            <Zap className="w-16 h-16 text-indigo-600 fill-current animate-pulse relative z-10" />
         </div>
      </div>

      {/* 3. Result Popup */}
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
               <p className="mt-1">Could you please send over the <span className="bg-yellow-100 px-1 rounded text-slate-900 font-medium">breakdown for the Q4 marketing budget</span>?</p>
               <p className="mt-1">I'd like to review it before our <span className="bg-yellow-100 px-1 rounded text-slate-900 font-medium">meeting tomorrow at 10 AM</span>.</p>
            </div>
         </div>
      </div>

      {/* ==================== UI LAYER ==================== */}

      {/* Header */}
      <div className="bg-[#f2f6fc] px-4 py-2 flex justify-between items-center shrink-0 rounded-t-xl cursor-default select-none border-b border-slate-100">
        <span className="font-medium text-slate-800 text-sm">New Message</span>
        <div className="flex gap-4 text-slate-600 items-center">
           <Minus size={14} className="cursor-pointer hover:bg-slate-200" />
           <Maximize2 size={12} className="cursor-pointer hover:bg-slate-200" />
           <X size={16} className="cursor-pointer hover:bg-slate-200" />
        </div>
      </div>

      {/* Body Area */}
      <div className="flex-1 flex flex-col relative bg-white">
        
        {/* To Field */}
        <div className="border-b border-slate-100 px-4 py-2 flex items-center h-10">
           <span className="text-slate-500 mr-2 text-sm">To</span>
           <div className="bg-white hover:bg-slate-100 border border-transparent hover:border-slate-200 rounded-full px-2 py-0.5 flex items-center gap-2 text-xs transition-colors cursor-pointer">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200" alt="James" className="w-5 h-5 rounded-full object-cover"/>
              <span className="text-slate-900 font-medium">James Wilson</span>
              <X size={12} className="text-slate-400 hover:text-slate-600"/>
           </div>
        </div>

        {/* Subject Field */}
        <div className="border-b border-slate-100 px-4 py-2 h-10 flex items-center">
           <input 
             type="text" 
             value="Q4 Marketing Budget" 
             readOnly 
             className="w-full outline-none text-slate-800 font-medium text-sm placeholder-slate-400 bg-transparent"
             placeholder="Subject"
           />
        </div>

        {/* Compose Area */}
        <div className="flex-1 p-4 relative cursor-text">
           <textarea 
             value={finalText} 
             readOnly 
             className="w-full h-full resize-none outline-none border-none text-sm text-slate-800 font-sans leading-relaxed bg-transparent" 
           />

           {/* AuxisAI Mic Button Overlay */}
           <div className={`
              absolute bottom-4 right-4 z-20 transition-all duration-300 transform
              ${phase === 2 || phase === 3 ? 'scale-110' : 'scale-100 hover:scale-105'}
           `}>
               <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center shadow-lg border border-slate-100 cursor-pointer
                  ${phase === 2 || phase === 3 
                    ? 'bg-gradient-to-r from-red-500 to-pink-600 ring-4 ring-red-50 shadow-red-200' 
                    : 'bg-white hover:bg-slate-50'
                  }
               `}>
                  {phase === 2 || phase === 3 ? (
                      <div className="flex gap-1 items-end h-4">
                        <div className="w-1 bg-white h-full animate-[wave_0.5s_ease-in-out_infinite]"></div>
                        <div className="w-1 bg-white h-2/3 animate-[wave_0.5s_ease-in-out_infinite_0.1s]"></div>
                        <div className="w-1 bg-white h-full animate-[wave_0.5s_ease-in-out_infinite_0.2s]"></div>
                      </div>
                  ) : (
                      <Mic className="w-5 h-5 text-indigo-600" />
                  )}
               </div>
               
               {/* Cursor Animation */}
               {phase === 1 && (
                  <div className="absolute top-1/2 left-1/2 z-50 transition-transform duration-700 ease-in-out translate-x-2 translate-y-2">
                      <MousePointer2 className="w-6 h-6 text-slate-900 fill-white drop-shadow-xl" />
                  </div>
               )}
           </div>
        </div>

        {/* Footer Area */}
        <div className="mt-auto">
           {/* Formatting Bar */}
           <div className="px-3 py-1 flex items-center gap-4 text-slate-600 border-b border-transparent">
              <div className="flex gap-2">
                 <Undo2 size={15} className="cursor-pointer hover:bg-slate-100 rounded p-0.5 box-content" />
                 <Redo2 size={15} className="cursor-pointer hover:bg-slate-100 rounded p-0.5 box-content" />
              </div>
              <div className="flex gap-1">
                 <div className="font-serif font-bold text-sm cursor-pointer hover:bg-slate-100 px-1 rounded">F</div>
                 <div className="flex items-center text-xs cursor-pointer hover:bg-slate-100 px-1 rounded">
                   <span className="mr-1">TT</span>
                   <ChevronDown size={10} />
                 </div>
              </div>
              <div className="flex gap-1 border-l border-slate-300 pl-2">
                 <Bold size={15} className="cursor-pointer hover:bg-slate-100 rounded p-0.5 box-content" />
                 <Italic size={15} className="cursor-pointer hover:bg-slate-100 rounded p-0.5 box-content" />
                 <Underline size={15} className="cursor-pointer hover:bg-slate-100 rounded p-0.5 box-content" />
                 <div className="flex items-center cursor-pointer hover:bg-slate-100 px-0.5 rounded text-slate-800">
                    <span className="font-bold text-sm">A</span>
                    <div className="w-2 h-0.5 bg-black mt-3 -ml-2"></div>
                 </div>
              </div>
              <div className="flex gap-1 border-l border-slate-300 pl-2">
                 <AlignLeft size={15} className="cursor-pointer hover:bg-slate-100 rounded p-0.5 box-content" />
                 <List size={15} className="cursor-pointer hover:bg-slate-100 rounded p-0.5 box-content" />
                 <ListOrdered size={15} className="cursor-pointer hover:bg-slate-100 rounded p-0.5 box-content" />
                 <Indent size={15} className="cursor-pointer hover:bg-slate-100 rounded p-0.5 box-content" />
              </div>
              <Quote size={15} className="cursor-pointer hover:bg-slate-100 rounded p-0.5 box-content" />
           </div>

           {/* Send & Actions Bar */}
           <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                 {/* Send Button */}
                 <div className="flex items-center bg-[#0b57d0] hover:bg-[#0948b3] text-white rounded-full transition-colors cursor-pointer shadow-sm">
                    <div className="px-5 py-2 text-sm font-medium border-r border-[#0948b3]">Send</div>
                    <div className="px-2 py-2.5">
                       <ChevronDown size={14} />
                    </div>
                 </div>
                 
                 {/* Actions */}
                 <div className="flex items-center gap-3 ml-2 text-slate-500">
                    <div className="cursor-pointer hover:bg-slate-100 p-1.5 rounded-full relative">
                       <span className="font-bold text-sm border-b-2 border-slate-400 pb-px">A</span>
                    </div>
                    <Paperclip size={18} className="cursor-pointer hover:bg-slate-100 p-1.5 box-content rounded-full" />
                    <Link size={18} className="cursor-pointer hover:bg-slate-100 p-1.5 box-content rounded-full" />
                    <Smile size={18} className="cursor-pointer hover:bg-slate-100 p-1.5 box-content rounded-full" />
                    <HardDrive size={18} className="cursor-pointer hover:bg-slate-100 p-1.5 box-content rounded-full" />
                    <ImageIcon size={18} className="cursor-pointer hover:bg-slate-100 p-1.5 box-content rounded-full" />
                    <Lock size={18} className="cursor-pointer hover:bg-slate-100 p-1.5 box-content rounded-full" />
                    <PenTool size={18} className="cursor-pointer hover:bg-slate-100 p-1.5 box-content rounded-full" />
                    <MoreVertical size={18} className="cursor-pointer hover:bg-slate-100 p-1.5 box-content rounded-full" />
                 </div>
              </div>
              
              <Trash2 size={18} className="text-slate-500 hover:text-slate-700 cursor-pointer p-2 box-content" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default GmailComposeAnimation;