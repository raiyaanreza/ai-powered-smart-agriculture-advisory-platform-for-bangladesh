"use client";
import { 
  Plus, 
  History, 
  MessageSquare, 
  Activity, 
  BarChart3, 
  Settings, 
  Headphones,
  Search,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

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

interface AdvisorySidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  conversations: ChatSession[];
  currentChatId: string;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onOpenHistory: () => void;
}

export function AdvisorySidebar({
  activeTab,
  setActiveTab,
  conversations,
  currentChatId,
  onSelectChat,
  onNewChat,
  onOpenHistory
}: AdvisorySidebarProps) {
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { name: "Chat History", icon: History, id: "history" },
    { name: "Crop Analysis", icon: Activity, id: "analysis" },
  ];

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(sidebarSearch.toLowerCase())
  );

  const SidebarContent = () => (
    <>
      <div className="p-6 flex-1 flex flex-col overflow-hidden">
        {/* New Chat CTA Button */}
        <button 
          onClick={() => {
            onNewChat();
            setIsMobileOpen(false);
          }}
          className="w-full py-4 rounded-2xl bg-primary text-white flex items-center justify-center gap-3 shadow-xl shadow-green-950/20 dark:shadow-none hover:opacity-90 active:scale-98 transition-all mb-8 group shrink-0"
        >
          <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
          <span className="text-[11px] font-black uppercase tracking-widest text-white">নতুন আলোচনা</span>
        </button>

        {/* Main Navigation Menu */}
        <nav className="space-y-1.5 shrink-0 mb-6">
          <span className="text-[10px] font-black text-slate-350 dark:text-slate-500 uppercase tracking-[0.2em] mb-3 block">মেনু</span>
          {menuItems.map((item) => {
            const isActive = activeTab === item.name;
            return (
              <button 
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name);
                  if (item.name === "Chat History") {
                    onOpenHistory();
                  }
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all active:scale-98 ${
                  isActive 
                    ? "bg-earth-900 dark:bg-emerald-950 text-white shadow-lg" 
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? "text-green-400" : ""}`} />
                <span className="text-[13px] font-bold">{item.name === "Chat History" ? "চ্যাট পরামর্শ" : item.name === "Crop Analysis" ? "ফসল বিশ্লেষণ" : "বাজার দর"}</span>
              </button>
            );
          })}
        </nav>

        {/* Recent Chat History and search */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-3 shrink-0">
            <span className="text-[10px] font-black text-slate-300 dark:text-slate-500 uppercase tracking-[0.2em]">সাম্প্রতিক আলোচনা</span>
            <button 
              onClick={() => {
                onOpenHistory();
                setIsMobileOpen(false);
              }}
              className="text-[9px] font-black text-green-700 dark:text-emerald-400 hover:text-green-950 dark:hover:text-emerald-300 uppercase tracking-widest px-2 py-1 rounded-lg hover:bg-green-50 dark:hover:bg-emerald-950/20 transition-all"
            >
              সব দেখুন
            </button>
          </div>

          {/* Quick Search bar */}
          <div className="relative mb-3 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input 
              type="text"
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              placeholder="আলোচনা খুঁজুন..."
              className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-[11px] font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-green-700/20 focus:border-green-700 transition-all"
            />
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
            {filteredConversations.length === 0 ? (
              <p className="text-[11px] font-bold text-slate-450 dark:text-slate-500 px-5 py-4 text-center">কোনো আলোচনা পাওয়া যায়নি।</p>
            ) : (
              filteredConversations.map((chat) => {
                const isSelected = chat.id === currentChatId && activeTab === "Chat History";
                return (
                  <button 
                    key={chat.id}
                    onClick={() => {
                      onSelectChat(chat.id);
                      setIsMobileOpen(false);
                    }}
                    className={`w-full text-left px-5 py-3 text-[12px] font-bold rounded-xl transition-all truncate flex items-center justify-between ${
                      isSelected 
                        ? "bg-green-50 dark:bg-emerald-950/30 text-green-950 dark:text-emerald-300 font-black border-l-4 border-primary" 
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100"
                    }`}
                  >
                    <span className="truncate flex-1 mr-2">{chat.title}</span>
                    <ChevronRight className={`h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity ${isSelected ? "opacity-100 text-green-700 dark:text-emerald-450" : "group-hover:opacity-100"}`} />
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Settings/Support Area */}
      <div className="p-6 border-t border-slate-100 dark:border-slate-850 space-y-4 shrink-0">
        <div className="space-y-1.5">
           {[
             { name: "Settings", icon: Settings },
             { name: "Support", icon: Headphones }
           ].map((item) => (
             <button 
               key={item.name} 
               disabled
               className="w-full flex items-center gap-4 px-5 py-2.5 text-slate-300 dark:text-slate-600 cursor-not-allowed"
             >
                <item.icon className="h-4.5 w-4.5" />
                <span className="text-[12px] font-bold">{item.name}</span>
             </button>
           ))}
        </div>

        <div className="bg-slate-50 dark:bg-slate-950/30 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
           <div className="relative z-10">
              <h4 className="text-[11px] font-black text-slate-900 dark:text-slate-100 mb-1.5">উন্নত চাষী সংস্করণ</h4>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold mb-3.5 leading-snug">স্যাটেলাইট ইমেজ ও দূরবর্তী মাটি পরীক্ষার সুবিধা পান।</p>
              <button disabled className="w-full py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 text-[9px] font-black uppercase tracking-widest cursor-not-allowed">
                 Upgrade to Pro
              </button>
           </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-750 dark:text-slate-305 transition-all"
        aria-label="Toggle sidebar menu"
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar - Desktop: sticky, Mobile: fixed drawer */}
      <aside className={`
        w-72 bg-white dark:bg-card border-r border-slate-100 dark:border-slate-900 flex flex-col h-full 
        lg:sticky lg:top-0 lg:shrink-0 lg:translate-x-0
        fixed top-0 left-0 z-45 h-full shadow-2xl transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <SidebarContent />
      </aside>
    </>
  );
}
