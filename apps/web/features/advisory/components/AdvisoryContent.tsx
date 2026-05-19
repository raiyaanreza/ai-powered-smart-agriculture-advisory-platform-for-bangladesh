"use client";
import { Paperclip, Mic, Send, CheckCircle2, Leaf, Zap, X, Plus } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  image?: string;
  diagnosis?: {
    title: string;
    description: string;
    steps: { label: string; action: string; status?: string }[];
  };
}

const QUICK_QUESTIONS = [
  "ধানের ব্লাস্ট রোগ হলে কী করবো?",
  "টমেটো গাছের পাতা কুঁকড়ে যাচ্ছে",
  "ভুট্টায় fall armyworm দেখা গেছে",
  "ধানে সার কতটুকু দিতে হবে?",
  "জমিতে সেচ কীভাবে দেব?",
  "নিম দিয়ে পোকা দমন করা যাবে?",
] as const;

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  isOfflineMode?: boolean;
  onSendMessage: (text: string, image: string | null) => void;
}

export function ChatInterface({
  messages,
  isLoading,
  isOfflineMode = false,
  onSendMessage,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = () => {
    if (!input.trim() && !selectedImage) return;
    onSendMessage(input, selectedImage);
    setInput("");
    setSelectedImage(null);
  };

  const handleQuickQuestion = (question: string) => {
    if (isLoading) return;
    onSendMessage(question, null);
    setInput("");
    setSelectedImage(null);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#FAFAFA]">
      {isOfflineMode && (
        <div className="shrink-0 px-4 pt-4 pb-0 sm:px-8">
          <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-900">
            অফলাইন মোড
          </span>
        </div>
      )}

      {/* Messages — scrollable; composer sits below in document flow */}
      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto space-y-10 px-4 py-6 pb-8 custom-scrollbar sm:px-8"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 max-w-xl mx-auto py-16">
            <div className="h-16 w-16 rounded-3xl bg-green-50 border border-green-100 flex items-center justify-center mb-6 text-green-700">
              <Leaf className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">AgriAdvisor এআই বিশেষজ্ঞের সাথে আলোচনা শুরু করুন</h3>
            <p className="text-[13px] font-semibold text-slate-400 mt-2 leading-relaxed">
              আপনার ফসল, মাটি, সার প্রয়োগ, বা পোকা দমনের যেকোনো প্রশ্ন এখানে লিখুন। প্রয়োজনে ফসলের আক্রান্ত অংশের ছবি আপলোড করে পরামর্শ নিন।
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'user' ? (
                  <div className="max-w-xl bg-[#052E16] text-white px-5 py-4 rounded-3xl rounded-tr-sm shadow-xl shadow-green-950/10">
                    <p className="text-[15px] font-medium leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    {msg.image && (
                      <div className="mt-4 rounded-2xl overflow-hidden shadow-lg border-2 border-white/10">
                         <img src={msg.image} alt="User Upload" className="w-full object-cover aspect-video" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-4 items-start max-w-3xl">
                     <div className="h-10 w-10 rounded-full bg-[#F0F7FF] border border-blue-100 flex items-center justify-center shrink-0">
                        <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                           <Leaf className="h-3.5 w-3.5 text-white" />
                        </div>
                     </div>
                     <div className="bg-white border border-slate-100 p-8 rounded-4xl rounded-tl-sm shadow-xl shadow-slate-200/40">
                        {msg.diagnosis ? (
                          <div className="space-y-6">
                             <h3 className="text-xl font-black text-slate-900 tracking-tight">{msg.diagnosis.title}</h3>
                             <p className="text-[15px] text-slate-600 leading-relaxed font-medium">{msg.diagnosis.description}</p>
                             
                             {/* Treatment Box */}
                             <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                                <h4 className="flex items-center gap-2 text-[11px] font-black text-slate-900 uppercase tracking-widest mb-6">
                                   <Plus className="h-3.5 w-3.5 rotate-45" /> Recommended Treatment Steps
                                </h4>
                                <div className="space-y-4">
                                   {msg.diagnosis.steps.map((step, i) => (
                                     <div key={i} className="flex gap-3">
                                        <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                                        <div>
                                           <p className="text-[13px] font-bold text-slate-900 leading-tight mb-1">
                                              {step.label}: <span className="font-medium text-slate-600">{step.action}</span>
                                              {step.status && (
                                                <span className="ml-2 px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[9px] font-black uppercase">
                                                  {step.status}
                                                </span>
                                              )}
                                           </p>
                                        </div>
                                     </div>
                                   ))}
                                </div>
                             </div>
                          </div>
                        ) : (
                          <FormattedMarkdown content={msg.text} />
                        )}
                     </div>
                  </div>
                )}
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-4 items-start max-w-3xl">
                  <div className="h-10 w-10 rounded-full bg-[#F0F7FF] border border-blue-100 flex items-center justify-center shrink-0">
                    <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <Leaf className="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>
                  <div className="bg-white border border-slate-100 px-6 py-5 rounded-4xl rounded-tl-sm shadow-sm">
                    <p className="text-[14px] font-semibold text-slate-600">
                      উত্তর প্রস্তুত করা হচ্ছে...
                    </p>
                    <div className="flex gap-2 mt-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-bounce" />
                      <div className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-bounce delay-100" />
                      <div className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Bottom composer — quick questions + input */}
      <div className="shrink-0 border-t border-slate-100 bg-[#FAFAFA] px-4 pt-3 pb-4 sm:px-6 sm:pb-6">
        <div className="mx-auto w-full max-w-4xl">
          
          {/* Image Preview */}
          <AnimatePresence>
            {selectedImage && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="mb-4 relative h-32 w-48 rounded-2xl overflow-hidden border-2 border-white shadow-2xl ring-4 ring-green-950/5"
              >
                <img src={selectedImage} className="h-full w-full object-cover" alt="Preview" />
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mb-3">
            <p className="text-[12px] font-bold text-slate-600 mb-2 px-1">
              দ্রুত প্রশ্ন করুন
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleQuickQuestion(question)}
                  className="w-full min-h-[44px] rounded-2xl border border-green-200 bg-green-50 px-3 py-2.5 text-left text-[13px] font-semibold leading-snug text-green-950 transition-colors hover:bg-green-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-[calc(50%-0.25rem)]"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-2 shadow-2xl flex items-center gap-2">
             <input 
               type="file" 
               hidden 
               ref={fileInputRef} 
               accept="image/*" 
               onChange={handleImageUpload} 
             />
             <button 
               onClick={() => fileInputRef.current?.click()}
               className={`h-12 w-12 rounded-full flex items-center justify-center transition-all ${selectedImage ? 'bg-green-50 text-green-600' : 'hover:bg-slate-50 text-slate-400'}`}
             >
                <Paperclip className="h-5 w-5" />
             </button>
             <input 
               type="text" 
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
               placeholder="পরামর্শ পেতে বার্তা লিখুন..."
               className="flex-1 bg-transparent border-none focus:outline-none text-[14px] font-bold text-slate-800 px-2 py-3"
             />
             <div className="flex items-center gap-2">
                <button className="h-12 w-12 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400">
                   <Mic className="h-5 w-5" />
                </button>
                <button 
                  onClick={handleSend}
                  disabled={isLoading || (!input.trim() && !selectedImage)}
                  className={`h-12 w-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all active:scale-95 ${
                    isLoading ? 'bg-slate-200' : 'bg-green-950 shadow-green-950/20'
                  }`}
                >
                   <Send className={`h-5 w-5 ${isLoading ? 'animate-pulse' : ''}`} />
                </button>
             </div>
          </div>
          <p className="text-center text-[10px] font-bold text-slate-400 mt-3.5 uppercase tracking-widest">
            AgriAdvisor ভুল পরামর্শ দিতে পারে। গুরুত্বপূর্ন কৃষি সিদ্ধান্ত নেয়ার পূর্বে যাচাই করুন।
          </p>
        </div>
      </div>
    </div>
  );
}

function FormattedMarkdown({ content }: { content: string }) {
  const lines = content.split('\n');
  
  return (
    <div className="space-y-3 text-[15px] leading-relaxed text-slate-600 font-medium">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        
        if (trimmed === '---') {
          return <hr key={index} className="my-4 border-slate-100" />;
        }
        
        if (trimmed.startsWith('###')) {
          const text = trimmed.replace(/^###\s*/, '');
          return (
            <h3 key={index} className="text-lg font-black text-slate-900 mt-6 mb-2 tracking-tight">
              {renderInlineStyles(text)}
            </h3>
          );
        }

        if (trimmed.startsWith('##')) {
          const text = trimmed.replace(/^##\s*/, '');
          return (
            <h2 key={index} className="text-xl font-black text-slate-900 mt-8 mb-3 tracking-tight border-b border-slate-50 pb-2">
              {renderInlineStyles(text)}
            </h2>
          );
        }

        if (trimmed.startsWith('#')) {
          const text = trimmed.replace(/^#\s*/, '');
          return (
            <h1 key={index} className="text-2xl font-black text-slate-950 mt-10 mb-4 tracking-tight">
              {renderInlineStyles(text)}
            </h1>
          );
        }

        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          const text = trimmed.replace(/^[*-\s]+/, '');
          return (
            <div key={index} className="flex items-start gap-2.5 pl-2 my-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-600 shrink-0 mt-2.5" />
              <p className="flex-1 text-[15px]">{renderInlineStyles(text)}</p>
            </div>
          );
        }

        const numMatch = trimmed.match(/^(\d+|\u09E6-\u09EF+)\.\s*(.*)/);
        if (numMatch) {
          const num = numMatch[1];
          const text = numMatch[2];
          return (
            <div key={index} className="flex items-start gap-2 pl-2 my-1">
              <span className="font-bold text-green-700 select-none shrink-0 min-w-[20px]">{num}.</span>
              <p className="flex-1 text-[15px]">{renderInlineStyles(text)}</p>
            </div>
          );
        }

        if (trimmed === '') {
          return <div key={index} className="h-2" />;
        }

        return (
          <p key={index} className="text-[15px] my-1">
            {renderInlineStyles(line)}
          </p>
        );
      })}
    </div>
  );
}

function renderInlineStyles(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  if (parts.length === 1) return text;
  
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return (
        <strong key={i} className="font-extrabold text-slate-900 bg-linear-to-r from-green-50 to-emerald-50 px-1.5 py-0.5 rounded-md border border-green-100/50 mx-0.5">
          {part}
        </strong>
      );
    }
    return part;
  });
}
