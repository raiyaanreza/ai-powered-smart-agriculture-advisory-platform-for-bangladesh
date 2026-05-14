"use client";
import { Paperclip, Mic, Send, CheckCircle2, Leaf, Zap, X, Plus } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
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

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;

    const userMsg: Message = { 
      id: Date.now().toString(), 
      role: "user", 
      text: input,
      image: selectedImage || undefined
    };
    
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    const currentImage = selectedImage;
    
    setInput("");
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8001/advisory/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: currentInput,
          image_data: currentImage ? currentImage.split(',')[1] : null,
          history: messages.map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.text }))
        })
      });

      if (!response.ok) throw new Error("Failed to connect to AgriAdvisor Service");
      
      const data = await response.json();

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: data.text,
        diagnosis: data.diagnosis
      }]);
    } catch (error) {
      console.error("Chat error:", error);
      // Fallback response for demonstration if backend is not reachable
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: "দুঃখিত, আমাদের বিশেষজ্ঞ সার্ভারের সাথে সংযোগ করা যাচ্ছে না। অনুগ্রহ করে নিশ্চিত করুন যে আপনার ইন্টারনেট সংযোগ ঠিক আছে এবং ব্যাকএন্ড সার্ভিসটি চালু আছে।"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAFAFA]">
      {/* Date Indicator */}
      <div className="flex justify-center py-6">
        <span className="px-4 py-1 rounded-full bg-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">Today</span>
      </div>

      {/* Messages Scroll Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 space-y-10 pb-[250px]">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'user' ? (
                <div className="max-w-2xl bg-[#2D5A27] text-white p-6 rounded-[2rem] rounded-tr-sm shadow-xl shadow-green-950/10">
                  <p className="text-[15px] font-medium leading-relaxed mb-4">{msg.text}</p>
                  {msg.image && (
                    <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-white/10">
                       <img src={msg.image} alt="User Upload" className="w-full object-cover aspect-video" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex gap-4 items-start max-w-3xl">
                   <div className="h-10 w-10 rounded-full bg-[#F0F7FF] border border-blue-100 flex items-center justify-center flex-shrink-0">
                      <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                         <Leaf className="h-3.5 w-3.5 text-white" />
                      </div>
                   </div>
                   <div className="bg-white border border-slate-100 p-8 rounded-[2rem] rounded-tl-sm shadow-xl shadow-slate-200/40">
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
                                      <CheckCircle2 className="h-4 w-4 text-[#EAB308] flex-shrink-0 mt-0.5" />
                                      <div>
                                         <p className="text-[13px] font-bold text-slate-900 leading-tight mb-1">
                                            {step.label}: <span className="font-medium text-slate-600">{step.action}</span>
                                            {step.status && (
                                              <span className="ml-2 px-2 py-0.5 rounded bg-gold-100 text-[#854D0E] text-[9px] font-black uppercase">
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
                        <p className="text-[15px] text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">{msg.text}</p>
                      )}
                   </div>
                </div>
              )}
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm animate-pulse">
                  <div className="flex gap-2">
                     <div className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-bounce" />
                     <div className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-bounce delay-100" />
                     <div className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-bounce delay-200" />
                  </div>
               </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Bar */}
      <div className="fixed bottom-0 left-72 right-0 p-8 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA] to-transparent pointer-events-none">
        <div className="w-full relative pointer-events-auto">
          
          {/* Image Preview */}
          <AnimatePresence>
            {selectedImage && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="mb-4 relative h-32 w-48 rounded-2xl overflow-hidden border-2 border-white shadow-2xl ring-4 ring-[#052E16]/5"
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

          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-2.5 shadow-2xl flex items-center gap-2">
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
               placeholder="Message AgriAdvisor..."
               className="flex-1 bg-transparent border-none focus:outline-none text-[15px] font-bold text-slate-800 px-2"
             />
             <div className="flex items-center gap-2">
                <button className="h-12 w-12 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400">
                   <Mic className="h-5 w-5" />
                </button>
                <button 
                  onClick={handleSend}
                  disabled={isLoading || (!input.trim() && !selectedImage)}
                  className={`h-12 w-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all active:scale-95 ${
                    isLoading ? 'bg-slate-200' : 'bg-[#052E16] shadow-green-950/20'
                  }`}
                >
                   <Send className={`h-5 w-5 ${isLoading ? 'animate-pulse' : ''}`} />
                </button>
             </div>
          </div>
          <p className="text-center text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-widest">
            AgriAdvisor can make mistakes. Verify important agricultural advice.
          </p>
        </div>
      </div>
    </div>
  );
}
