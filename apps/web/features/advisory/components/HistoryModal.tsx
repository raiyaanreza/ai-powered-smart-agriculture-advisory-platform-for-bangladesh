"use client";
import { useState } from "react";
import { X, Search, Trash2, MessageSquare, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  date: string;
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: ChatSession[];
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
}

export function HistoryModal({
  isOpen,
  onClose,
  conversations,
  onSelectChat,
  onDeleteChat
}: HistoryModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Glass Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 transition-opacity"
          />

          {/* Sliding Drawer Container */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed top-0 bottom-0 left-0 w-full max-w-md bg-white/95 backdrop-blur-md shadow-2xl border-r border-slate-100 flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">চ্যাট ইতিহাস</h3>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Chat Logs & Sessions</p>
              </div>
              <button
                onClick={onClose}
                className="h-10 w-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-6 bg-slate-50/50 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ইতিহাস খুঁজুন..."
                  className="w-full bg-white border border-slate-200/80 rounded-2xl pl-11 pr-4 py-3 text-[13px] font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-700/10 focus:border-green-700 transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <MessageSquare className="h-8 w-8 text-slate-300 mb-2" />
                  <p className="text-[13px] font-bold text-slate-400">কোনো ইতিহাস পাওয়া যায়নি।</p>
                </div>
              ) : (
                filtered.map((item) => (
                  <div
                    key={item.id}
                    className="group relative flex items-center justify-between bg-slate-50 hover:bg-slate-100/70 p-4 rounded-2xl border border-slate-100 hover:border-slate-200/50 transition-all cursor-pointer"
                    onClick={() => onSelectChat(item.id)}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0 pr-8">
                      <div className="h-9 w-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0 border border-green-100/50">
                        <MessageSquare className="h-4.5 w-4.5 text-green-700" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-[13px] font-extrabold text-slate-800 truncate mb-1">
                          {item.title}
                        </h4>
                        <span className="text-[10px] font-bold text-slate-400">
                          {item.date} • {item.messages.length}টি বার্তা
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChat(item.id);
                        }}
                        className="h-8 w-8 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 md:opacity-0 focus:opacity-100"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <ChevronRight className="h-4.5 w-4.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-slate-50/50 border-t border-slate-100 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                AgriAdvisor Smart Agriculture Platform
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

