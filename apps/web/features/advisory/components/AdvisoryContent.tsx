"use client";
import { Paperclip, Mic, MicOff, Send, CheckCircle2, Leaf, Zap, X, Plus, Play, Pause, Square, Volume2, VolumeX, Copy, Check, FileDown } from "lucide-react";
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

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string, image: string | null) => void;
}

interface Citation {
  id: string;
  source: string;
  doi: string;
  citation: string;
}

function parseCitations(content: string): { mainContent: string; citations: Citation[] } {
  if (!content) return { mainContent: "", citations: [] };

  const lines = content.split("\n");
  const citationLines: string[] = [];
  const mainLines: string[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (
      (trimmed.includes("উৎস (Source)") || 
       trimmed.includes("Source (উৎস)") || 
       trimmed.includes("উৎস:") || 
       trimmed.includes("Source:") ||
       trimmed.includes("**উৎস")) &&
      (trimmed.includes("সাইটেশন") || 
       trimmed.includes("Citation") || 
       trimmed.includes("citation"))
    ) {
      citationLines.push(trimmed);
    } else {
      mainLines.push(line);
    }
  }
  
  const citations: Citation[] = citationLines.map((line, idx) => {
    let source = "Unknown";
    let doi = "N/A";
    let citation = "";
    
    // Parse Source: matches "**উৎস (Source):** [value]" or "উৎস (Source): [value]" or "Source: [value]"
    const sourceMatch = line.match(/(?:উৎস\s*\(Source\)|Source):\s*\**([^\*|]+)/i);
    if (sourceMatch) {
      source = sourceMatch[1].trim();
    }
    
    // Parse DOI: matches "**ডিওআই (DOI):** [value]" or "ডিওআই (DOI): [value]" or "DOI: [value]"
    const doiMatch = line.match(/(?:ডিওআই\s*\(DOI\)|DOI):\s*\**([^\*|]+)/i);
    if (doiMatch) {
      doi = doiMatch[1].trim();
    }
    
    // Parse Citation: matches "**সাইটেশন (Citation):** [value]" or "সাইটেশন (Citation): [value]" or "Citation: [value]"
    const citationMatch = line.match(/(?:সাইটেশন\s*\(Citation\)|Citation):\s*\**([^\*|]+)/i);
    if (citationMatch) {
      citation = citationMatch[1].trim();
    } else {
      const parts = line.split("|");
      if (parts.length >= 3) {
        citation = parts[2].replace(/.*?(?:সাইটেশন\s*\(Citation\)|Citation):\s*/i, "").trim();
      } else {
        citation = line;
      }
    }
    
    source = source.replace(/^\*+|\*+$/g, "").trim();
    doi = doi.replace(/^\*+|\*+$/g, "").trim();
    citation = citation.replace(/^\*+|\*+$/g, "").trim();
    
    return {
      id: `cit_${idx}_${Date.now()}`,
      source,
      doi,
      citation
    };
  });
  
  return {
    mainContent: mainLines.join("\n").trim(),
    citations
  };
}

export function ChatInterface({
  messages,
  isLoading,
  onSendMessage
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 128)}px`;
    }
  }, [input]);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech recognition is not supported in this browser.");
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "bn-BD";
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.onerror = (e: any) => {
        console.error("Speech recognition error:", e);
        setIsListening(false);
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + (prev ? " " : "") + transcript);
      };
      
      recognitionRef.current = recognition;
      recognition.start();
    }
  };

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

  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth"
        });
      }
    };
    
    scrollToBottom();
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden transition-colors duration-200">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-10 pb-40 custom-scrollbar">
        <div className="max-w-4xl mx-auto w-full space-y-10">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 max-w-xl mx-auto py-16">
              <div className="h-16 w-16 rounded-3xl bg-green-50 dark:bg-emerald-950/20 border border-green-100 dark:border-emerald-900/30 flex items-center justify-center mb-6 text-green-700 dark:text-emerald-450">
                <Leaf className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">AgriAdvisor এআই বিশেষজ্ঞের সাথে আলোচনা শুরু করুন</h3>
              <p className="text-[13px] font-semibold text-slate-400 dark:text-slate-500 mt-2 leading-relaxed">
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
                    <div className="max-w-xl bg-earth-900 dark:bg-emerald-900 text-white dark:text-slate-950 px-5 py-4 rounded-3xl rounded-tr-sm shadow-xl shadow-green-950/10">
                      <p className="text-[15px] font-medium leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      {msg.image && (
                        <div className="mt-4 rounded-2xl overflow-hidden shadow-lg border-2 border-white/10">
                           <img src={msg.image} alt="User Upload" className="w-full object-cover aspect-video" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex gap-4 items-start max-w-full w-full">
                       <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 flex items-center justify-center shrink-0">
                          <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                             <Leaf className="h-3.5 w-3.5 text-white" />
                          </div>
                       </div>
                       <div className="bg-card border border-border p-6 sm:p-8 rounded-3xl rounded-tl-sm shadow-xl shadow-slate-200/40 dark:shadow-black/50 flex-1">
                          {msg.diagnosis ? (
                            <div className="space-y-6">
                               <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{msg.diagnosis.title}</h3>
                               <p className="text-[15px] text-slate-650 dark:text-slate-300 leading-relaxed font-medium">{msg.diagnosis.description}</p>
                               
                               <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-6">
                                   <h4 className="flex items-center gap-2 text-[11px] font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest mb-6">
                                      <Plus className="h-3.5 w-3.5 rotate-45" /> Recommended Treatment Steps
                                   </h4>
                                   <div className="space-y-4">
                                      {msg.diagnosis.steps.map((step, i) => (
                                        <div key={i} className="flex gap-3">
                                           <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                                           <div>
                                              <p className="text-[13px] font-bold text-slate-900 dark:text-slate-100 leading-tight mb-1">
                                                 {step.label}: <span className="font-medium text-slate-600 dark:text-slate-350">{step.action}</span>
                                                 {step.status && (
                                                   <span className="ml-2 px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-450 text-[9px] font-black uppercase">
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
                            (() => {
                              const { mainContent, citations } = parseCitations(msg.text);
                              return (
                                <div className="space-y-4">
                                  <FormattedMarkdown content={mainContent} />
                                  
                                  {citations.length > 0 && (
                                    <div className="mt-6 border-t border-slate-100 dark:border-slate-800/80 pt-5">
                                      <div className="flex items-center gap-2 text-[11px] font-black text-green-700 dark:text-emerald-450 uppercase tracking-widest mb-3">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                        <span>যাচাইকৃত তথ্যসূত্র ও উৎস ({citations.length})</span>
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                        {citations.map((c) => (
                                          <div 
                                            key={c.id} 
                                            className="bg-slate-50/50 dark:bg-slate-900/30 border border-slate-150/80 dark:border-slate-800/60 rounded-xl p-3.5 hover:border-green-200/50 dark:hover:border-emerald-900 transition-all flex flex-col justify-between"
                                          >
                                            <p className="text-[12.5px] text-slate-650 dark:text-slate-350 font-medium leading-relaxed mb-3">
                                              {c.citation}
                                            </p>
                                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/50">
                                              <span className="px-2 py-0.5 rounded bg-green-50 dark:bg-emerald-950/40 text-green-700 dark:text-emerald-450 text-[9px] font-black uppercase tracking-wider">
                                                {c.source}
                                              </span>
                                              {c.doi && c.doi !== "N/A" && c.doi !== "Unknown" && (
                                                <a 
                                                  href={c.doi.startsWith("http") ? c.doi : `https://doi.org/${c.doi}`} 
                                                  target="_blank" 
                                                  rel="noopener noreferrer"
                                                  className="text-[9px] text-blue-600 dark:text-blue-400 hover:underline font-extrabold flex items-center gap-0.5"
                                                >
                                                  DOI: {c.doi}
                                                </a>
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  
                                  <AdvisoryActions text={mainContent} />
                                </div>
                              );
                            })()
                          )}
                       </div>
                    </div>
                  )}
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                   <div className="bg-card border border-border p-6 rounded-3xl shadow-xs animate-pulse">
                      <div className="flex gap-2">
                         <div className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-700 animate-bounce" />
                         <div className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-700 animate-bounce delay-100" />
                         <div className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-700 animate-bounce delay-200" />
                      </div>
                   </div>
                </div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none z-10 shrink-0">
        <div className="w-full max-w-4xl mx-auto relative pointer-events-auto">
          
          <AnimatePresence>
            {selectedImage && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="mb-4 relative h-32 w-48 rounded-2xl overflow-hidden border-2 border-white dark:border-slate-850 shadow-2xl"
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

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/85 rounded-3xl p-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] flex items-center gap-2 focus-within:ring-2 focus-within:ring-emerald-500/20 dark:focus-within:ring-emerald-500/10 focus-within:border-emerald-500/55 dark:focus-within:border-emerald-500/35 transition-all duration-300">
             <input 
               type="file" 
               hidden 
               ref={fileInputRef} 
               accept="image/*" 
               onChange={handleImageUpload} 
             />
             <button 
               onClick={() => fileInputRef.current?.click()}
               className={`h-11 w-11 rounded-full flex items-center justify-center transition-all duration-200 ${selectedImage ? 'bg-green-50 dark:bg-emerald-950/30 text-green-600 dark:text-emerald-400' : 'hover:bg-slate-100/70 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
             >
                <Paperclip className="h-5 w-5" />
             </button>
             <textarea 
               ref={textareaRef}
               rows={1}
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => {
                 if (e.key === 'Enter' && !e.shiftKey) {
                   e.preventDefault();
                   handleSend();
                 }
               }}
               placeholder="পরামর্শ পেতে বার্তা লিখুন..."
               className="flex-1 bg-transparent border-none focus:outline-none text-[14px] font-semibold text-slate-800 dark:text-slate-100 px-2 py-3 resize-none max-h-32 custom-scrollbar placeholder-slate-400 dark:placeholder-slate-500"
             />
             <div className="flex items-center gap-2 self-end">
                 <button 
                    onClick={toggleListening}
                    className={`h-11 w-11 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isListening 
                        ? 'bg-red-50 dark:bg-red-950/20 text-red-600 animate-pulse border border-red-100' 
                        : 'hover:bg-slate-100/70 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                    title="ইংলিশ ভয়েস ইনপুট"
                  >
                     {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </button>
                 <button 
                   onClick={handleSend}
                   disabled={isLoading || (!input.trim() && !selectedImage)}
                   className={`h-11 w-11 rounded-full flex items-center justify-center text-white transition-all duration-200 shadow-md ${
                     isLoading || (!input.trim() && !selectedImage)
                       ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-650 cursor-not-allowed shadow-none' 
                       : 'bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 active:scale-95 text-white shadow-emerald-600/10 hover:shadow-emerald-600/25'
                   }`}
                 >
                    <Send className={`h-4.5 w-4.5 ${isLoading ? 'animate-pulse' : ''}`} />
                  </button>
             </div>
          </div>
          <p className="text-center text-[10px] font-bold text-slate-400 dark:text-slate-550 mt-3.5 uppercase tracking-widest">
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
    <div className="space-y-3 text-[15px] leading-relaxed text-slate-650 dark:text-slate-300 font-medium">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        
        if (trimmed === '---') {
          return <hr key={index} className="my-4 border-border" />;
        }
        
        if (trimmed.startsWith('###')) {
          const text = trimmed.replace(/^###\s*/, '');
          return (
            <h3 key={index} className="text-lg font-black text-slate-900 dark:text-slate-100 mt-6 mb-2 tracking-tight">
              {renderInlineStyles(text)}
            </h3>
          );
        }
        
        if (trimmed.startsWith('##')) {
          const text = trimmed.replace(/^##\s*/, '');
          return (
            <h2 key={index} className="text-xl font-black text-slate-900 dark:text-white mt-8 mb-3 tracking-tight border-b border-border pb-2">
              {renderInlineStyles(text)}
            </h2>
          );
        }
        
        if (trimmed.startsWith('#')) {
          const text = trimmed.replace(/^#\s*/, '');
          return (
            <h1 key={index} className="text-2xl font-black text-slate-950 dark:text-white mt-10 mb-4 tracking-tight">
              {renderInlineStyles(text)}
            </h1>
          );
        }
        
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          const text = trimmed.replace(/^[*-\s]+/, '');
          return (
            <div key={index} className="flex items-start gap-2.5 pl-2 my-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-emerald-500 shrink-0 mt-2.5" />
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
              <span className="font-bold text-green-700 dark:text-emerald-450 select-none shrink-0 min-w-[20px]">{num}.</span>
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
        <strong key={i} className="font-extrabold text-slate-900 dark:text-emerald-300 bg-linear-to-r from-green-50/10 to-emerald-50/10 px-1.5 py-0.5 rounded-md border border-green-100/20 mx-0.5">
          {part}
        </strong>
      );
    }
    return part;
  });
}

function AdvisoryActions({ text }: { text: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportDocx = () => {
    const header = "🌾 AGRIVISION AI - EXPERT ADVISOR REPORT\n=============================================\n\n";
    const cleanText = text.replace(/[*#_\-\+`]/g, "");
    const blob = new Blob([header + cleanText], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Advisory_Report_${Date.now()}.docx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const togglePlay = async () => {
    if (isPlaying) {
      if (audio) {
        audio.pause();
      } else if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      return;
    }

    const cleanText = text.replace(/[*#_\-\+`]/g, "").replace(/\[.*?\]\(.*?\)/g, "").trim();
    if (!cleanText) return;

    setIsPlaying(true);

    try {
      const url = `/api/voice/tts?text=${encodeURIComponent(cleanText)}`;
      const newAudio = new Audio(url);
      setAudio(newAudio);
      
      newAudio.onended = () => {
        setIsPlaying(false);
        setAudio(null);
      };
      
      newAudio.onerror = (e) => {
        console.error("Gemini TTS playback failed, falling back to Web Speech API:", e);
        newAudio.pause();
        setAudio(null);
        fallbackSpeechSynthesis(cleanText);
      };

      await newAudio.play();
    } catch (err) {
      console.error("Error playing Gemini TTS:", err);
      fallbackSpeechSynthesis(cleanText);
    }
  };

  const fallbackSpeechSynthesis = (cleanText: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voices = window.speechSynthesis.getVoices();
    const banglaVoice = voices.find(v => 
      v.lang.toLowerCase().includes("bn") || 
      v.name.toLowerCase().includes("bangla") || 
      v.name.toLowerCase().includes("bengali")
    );
    
    if (banglaVoice) {
      utterance.voice = banglaVoice;
      utterance.lang = banglaVoice.lang;
    } else {
      const defaultVoice = voices.find(v => v.default) || voices[0];
      if (defaultVoice) {
        utterance.voice = defaultVoice;
        utterance.lang = defaultVoice.lang;
      }
    }
    
    utterance.pitch = 1.0;
    utterance.rate = 0.95;
    
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = (e) => {
      console.error("SpeechSynthesis error:", e);
      setIsPlaying(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
      }
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [audio]);

  return (
    <div className="mt-4 flex items-center gap-2">
      <button
        onClick={togglePlay}
        className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all ${isPlaying ? 'bg-red-50 dark:bg-red-950/20 text-red-600 border border-red-100 dark:border-red-900/30' : 'bg-slate-50 dark:bg-slate-905/40 text-slate-400 dark:text-slate-500 hover:text-slate-705 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-100 dark:border-slate-800'}`}
        title="বাংলায় শুনুন"
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
      <button
        onClick={handleCopy}
        className="h-8 w-8 rounded-lg flex items-center justify-center bg-slate-50 dark:bg-slate-905/40 text-slate-400 dark:text-slate-500 hover:text-slate-705 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-all"
        title="কপি করুন"
      >
        {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
      </button>
      <button
        onClick={handleExportDocx}
        className="h-8 w-8 rounded-lg flex items-center justify-center bg-slate-50 dark:bg-slate-905/40 text-slate-400 dark:text-slate-500 hover:text-slate-705 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-all"
        title="ডাউনলোড করুন (.docx)"
      >
        <FileDown className="h-4 w-4" />
      </button>
    </div>
  );
}
