"use client";
import { 
  Plus, 
  History, 
  MessageSquare, 
  Activity, 
  BarChart3, 
  Settings, 
  Headphones
} from "lucide-react";
import { useState } from "react";

export function AdvisorySidebar() {
  const [activeTab, setActiveTab] = useState("Chat History");

  const menuItems = [
    { name: "New Chat", icon: MessageSquare, id: "new" },
    { name: "Chat History", icon: History, id: "history" },
    { name: "Crop Analysis", icon: Activity, id: "analysis" },
    { name: "Market Rates", icon: BarChart3, id: "market" },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-100 flex flex-col h-full sticky top-0">
      <div className="p-8">
        <button className="w-full py-4 rounded-2xl bg-[#2D5A27] text-white flex items-center justify-center gap-3 shadow-xl shadow-green-950/20 hover:bg-[#1A321A] transition-all mb-10 group">
          <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
          <span className="text-[11px] font-black uppercase tracking-widest">New Chat</span>
        </button>

        <nav className="space-y-2">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4 block">Navigation</span>
          {menuItems.map((item) => {
            const isActive = activeTab === item.name;
            return (
              <button 
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
                  isActive ? "bg-[#052E16] text-white shadow-lg" : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? "text-green-400" : ""}`} />
                <span className="text-[13px] font-bold">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-8 space-y-6">
        <div className="space-y-2">
           <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4 block">Recent History</span>
           {["Tomato Blight Treatment...", "NPK Ratio for Corn stage 2"].map((item) => (
             <button key={item} className="w-full text-left px-5 py-2 text-[12px] font-bold text-slate-500 hover:text-slate-900 transition-colors truncate">
               {item}
             </button>
           ))}
        </div>

        <div className="pt-6 border-t border-slate-100 space-y-2">
           {[
             { name: "Settings", icon: Settings },
             { name: "Support", icon: Headphones }
           ].map((item) => (
             <button key={item.name} className="w-full flex items-center gap-4 px-5 py-3 text-slate-400 hover:text-slate-900 transition-all">
                <item.icon className="h-5 w-5" />
                <span className="text-[12px] font-bold">{item.name}</span>
             </button>
           ))}
        </div>

        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative overflow-hidden group">
           <div className="relative z-10">
              <h4 className="text-[11px] font-black text-slate-900 mb-2">Upgrade to Pro</h4>
              <p className="text-[9px] text-slate-400 font-bold mb-4">Get advanced soil analysis and satellite imagery.</p>
              <button className="w-full py-2.5 rounded-xl border-2 border-slate-900 text-slate-900 text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                 Upgrade
              </button>
           </div>
        </div>
      </div>
    </aside>
  );
}
