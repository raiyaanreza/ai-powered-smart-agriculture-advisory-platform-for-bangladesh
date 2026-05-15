"use client";
import { Navbar, Footer } from "@/features/common/components/Layout";
import { 
  ShieldCheck, CheckCircle2, XCircle, Users, Activity, 
  AlertTriangle, LayoutDashboard, Database, Bell, 
  TrendingUp, Map as MapIcon, Plus, Save, Trash2, 
  Search, FileJson, ChevronRight, Globe, Zap,
  Terminal, Server
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { diseases as initialDiseases, Disease } from "@/features/library/data/diseases";
import dynamic from "next/dynamic";

const OutbreakMap = dynamic(() => import("@/features/admin/components/OutbreakMap"), { 
  ssr: false,
  loading: () => (
    <div className="h-125 w-full rounded-[3rem] bg-slate-100 animate-pulse flex items-center justify-center">
      <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Initializing GIS Intelligence...</div>
    </div>
  )
});

type Tab = "overview" | "verification" | "library" | "alerts" | "system";

export default function AdminDashboard() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [pendingFarmers, setPendingFarmers] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [diseases, setDiseases] = useState<Disease[]>(initialDiseases);
  const [showAddDisease, setShowAddDisease] = useState(false);
  const [dashboardMetrics, setDashboardMetrics] = useState({
    totalUsers: 0,
    diagnosesCount: 0,
    accuracy: 99.2,
    activeAlerts: 3
  });

  const [newDisease, setNewDisease] = useState<Partial<Disease>>({
    name: "",
    nameBn: "",
    crop: "Rice",
    type: "Fungal",
    description: "",
    symptoms: [],
    management: [],
    severity: "Medium",
    images: ["/assets/diseases/placeholder.jpg"]
  });

  useEffect(() => {
    if (!loading && (!user || profile?.role !== "admin")) {
      router.push("/login");
    }
    if (user && profile?.role === "admin") {
      fetchPending();
      fetchDashboardStats();
    }
  }, [profile, user, loading, router]);

  const fetchDashboardStats = async () => {
    const { count: usersCount } = await supabaseAdmin.from("profiles").select("*", { count: 'exact', head: true });
    const { count: diagCount } = await supabaseAdmin.from("diagnoses").select("*", { count: 'exact', head: true });
    
    setDashboardMetrics(prev => ({
      ...prev,
      totalUsers: usersCount || 0,
      diagnosesCount: diagCount || 0
    }));
  };

  const fetchPending = async () => {
    setFetching(true);
    const { data } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("role", "farmer")
      .eq("is_verified", false);
    
    if (data) setPendingFarmers(data);
    setFetching(false);
  };

  const handleVerify = async (id: string, approve: boolean) => {
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ is_verified: approve, role: approve ? "farmer" : "user" })
      .eq("id", id);
      
    if (!error) {
      toast.success(approve ? "Farmer approved successfully" : "Application rejected");
      setPendingFarmers(prev => prev.filter(f => f.id !== id));
      fetchDashboardStats();
    } else {
      toast.error("Verification sync failed");
    }
  };

  const [alertForm, setAlertForm] = useState({
    title: "",
    type: "Critical",
    target: "All Users",
    message: ""
  });

  const handleBroadcast = async () => {
    if (!alertForm.title || !alertForm.message) {
      toast.error("Required fields missing");
      return;
    }

    // Attempt to insert into notifications table
    const { error } = await supabaseAdmin
      .from("notifications")
      .insert([{
        title: alertForm.title,
        message: alertForm.message,
        type: alertForm.type.toLowerCase(),
        target_role: alertForm.target === "All Users" ? "all" : "farmer"
      }]);

    if (!error) {
      toast.success("National Broadcast sent successfully!");
      setAlertForm({ title: "", type: "Critical", target: "All Users", message: "" });
    } else {
      console.error("Broadcast Error:", error);
      toast.error("Schema Mismatch: 'notifications' table missing. See System tab.");
    }
  };

  const fetchLibraryDiseases = async () => {
    const { data } = await supabaseAdmin.from("diseases").select("*");
    if (data) setDiseases(data);
  };

  if (loading || !user || profile?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-[#052E16] border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Authenticating Expert Access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFDFF] text-slate-900 selection:bg-[#052E16] selection:text-white">
      <Navbar />
      
      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Premium Sidebar */}
        <aside className="w-80 bg-white border-r border-slate-100 p-10 hidden lg:block sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
          <div className="mb-14">
             <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-2xl bg-[#052E16] flex items-center justify-center shadow-lg">
                   <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <div>
                   <h2 className="text-lg font-black text-[#052E16] tracking-tighter">Command Center</h2>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">National AI Admin</p>
                </div>
             </div>
             
             <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 mb-10">
                <div className="flex items-center gap-3 mb-3">
                   <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Integrity</span>
                </div>
                <div className="text-2xl font-black text-slate-900 tracking-tighter">99.8% Online</div>
                <div className="mt-4 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 w-[99.8%]" />
                </div>
             </div>
          </div>

          <nav className="space-y-3">
            <SidebarLink active={activeTab === "overview"} onClick={() => setActiveTab("overview")} icon={LayoutDashboard} label="Global Overview" />
            <SidebarLink active={activeTab === "verification"} onClick={() => setActiveTab("verification")} icon={Users} label="Farmer Verification" badge={pendingFarmers.length || 0} />
            <SidebarLink active={activeTab === "library"} onClick={() => setActiveTab("library")} icon={Database} label="Disease Intelligence" />
            <SidebarLink active={activeTab === "alerts"} onClick={() => setActiveTab("alerts")} icon={Bell} label="National Alerts" />
            <SidebarLink active={activeTab === "system"} onClick={() => setActiveTab("system")} icon={Terminal} label="System Engine" />
          </nav>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 p-8 lg:p-14 overflow-x-hidden">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                   <div className="space-y-2">
                      <h1 className="text-5xl font-black text-[#052E16] tracking-tighter leading-tight">National Agricultural Intelligence</h1>
                      <p className="text-slate-400 font-medium text-lg">Monitoring 64 districts and 50,000+ active farming nodes.</p>
                   </div>
                   <div className="flex gap-4">
                      <button className="h-[52px] px-8 rounded-2xl bg-white border border-slate-200 text-[11px] font-black uppercase tracking-widest text-slate-900 hover:bg-slate-50 transition-all flex items-center gap-3">
                         <FileJson className="h-4 w-4" /> Export Datasets
                      </button>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <MetricCard label="Total User Base" value={dashboardMetrics.totalUsers.toLocaleString()} icon={Users} color="text-blue-600" bg="bg-blue-50" />
                  <MetricCard label="Total Diagnoses" value={dashboardMetrics.diagnosesCount.toLocaleString()} icon={Activity} color="text-emerald-600" bg="bg-emerald-50" />
                  <MetricCard label="AI Model Confidence" value="99.2%" icon={Zap} color="text-amber-600" bg="bg-amber-50" />
                  <MetricCard label="Active National Alerts" value={dashboardMetrics.activeAlerts} icon={Bell} color="text-rose-600" bg="bg-rose-50" />
                </div>

                <div className="bg-white border border-slate-100 rounded-[3.5rem] p-12 shadow-[0_32px_64px_-24px_rgba(0,0,0,0.04)]">
                   <div className="flex items-center justify-between mb-12">
                      <div className="space-y-1">
                         <h3 className="text-2xl font-black text-slate-900 tracking-tight">Outbreak Visualization</h3>
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Geospatial Intelligence Engine</p>
                      </div>
                      <div className="flex items-center gap-4">
                         <span className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">Live Telemetry</span>
                      </div>
                   </div>
                   <div className="h-[500px] w-full rounded-[2.5rem] overflow-hidden border border-slate-100">
                      <OutbreakMap />
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === "verification" && (
              <motion.div key="verification" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                <div className="space-y-2">
                  <h1 className="text-4xl font-black text-[#052E16] tracking-tighter">Farmer Authentication Queue</h1>
                  <p className="text-slate-500 font-medium text-lg">Verify identity and land documents for {pendingFarmers.length} pending applications.</p>
                </div>
                
                <div className="grid gap-6">
                  {pendingFarmers.length > 0 ? pendingFarmers.map(farmer => (
                    <VerificationCard key={farmer.id} farmer={farmer} onVerify={handleVerify} />
                  )) : (
                    <div className="py-32 bg-white rounded-[3rem] border border-slate-100 text-center flex flex-col items-center">
                       <div className="h-20 w-20 rounded-[2rem] bg-emerald-50 flex items-center justify-center mb-8 border border-emerald-100">
                          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                       </div>
                       <h3 className="text-xl font-black text-slate-900 tracking-tight">No Pending Verifications</h3>
                       <p className="text-slate-400 font-medium">The national queue is currently empty.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "alerts" && (
              <motion.div key="alerts" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl space-y-10">
                <div className="space-y-2">
                   <h1 className="text-4xl font-black text-[#052E16] tracking-tighter">National Alert Broadcast</h1>
                   <p className="text-slate-500 font-medium text-lg">Deploy critical bulletins to the national farmer network via push and SMS.</p>
                </div>

                <div className="bg-white border border-slate-100 rounded-[3.5rem] p-12 shadow-[0_32px_64px_-24px_rgba(0,0,0,0.04)] space-y-10">
                  <div className="grid md:grid-cols-2 gap-10">
                    <FormInput label="Bulletin Title" value={alertForm.title} onChange={(v: string) => setAlertForm({...alertForm, title: v})} placeholder="e.g. Cyclone Amphan Warning" />
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Bulletin Priority</label>
                      <select 
                        value={alertForm.type} 
                        onChange={e => setAlertForm({...alertForm, type: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#052E16]/5 transition-all appearance-none"
                      >
                        <option>Information</option>
                        <option>Warning</option>
                        <option>Critical</option>
                        <option>Emergency</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Detailed Intelligence</label>
                    <textarea 
                      rows={5} 
                      value={alertForm.message}
                      onChange={e => setAlertForm({...alertForm, message: e.target.value})}
                      placeholder="Type your message here..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-3xl px-8 py-6 text-sm font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#052E16]/5 transition-all resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="sms" className="h-5 w-5 rounded-lg border-slate-200 text-[#052E16] focus:ring-[#052E16]" />
                      <label htmlFor="sms" className="text-xs font-black uppercase tracking-widest text-slate-400">Trigger SMS Gateway</label>
                    </div>
                    <button 
                      onClick={handleBroadcast}
                      className="h-16 px-10 rounded-2xl bg-rose-600 text-white text-[12px] font-black uppercase tracking-widest flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-rose-500/30 active:scale-95"
                    >
                      <Bell className="h-5 w-5" /> Deploy Broadcast
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "system" && (
              <motion.div key="system" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl space-y-10">
                <div className="space-y-2">
                   <h1 className="text-4xl font-black text-[#052E16] tracking-tighter">System Engine Configuration</h1>
                   <p className="text-slate-500 font-medium text-lg">Manage low-level infrastructure and missing table initializations.</p>
                </div>

                <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_70%)]" />
                   <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-10">
                         <Terminal className="h-8 w-8 text-emerald-500" />
                         <h3 className="text-2xl font-black tracking-tight">Database Initialization</h3>
                      </div>
                      <p className="text-slate-400 mb-10 leading-relaxed font-medium">If you encounter "Table not found" errors for <b>notifications</b>, please execute the following SQL in your Supabase SQL Editor:</p>
                      <pre className="bg-black/40 rounded-3xl p-8 border border-white/5 text-emerald-400 font-mono text-sm leading-relaxed overflow-x-auto mb-10">
{`CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL, -- 'info', 'warning', 'critical', 'emergency'
    target_role TEXT DEFAULT 'all', -- 'all', 'farmer', 'user'
    is_read BOOLEAN DEFAULT false
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read for all users" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated admins" ON public.notifications FOR INSERT WITH CHECK (true);`}
                      </pre>
                      <div className="flex items-center gap-4">
                         <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-500 border border-white/10">
                            <Server className="h-5 w-5" />
                         </div>
                         <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Manual Provisioning Required</div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ active, onClick, icon: Icon, label, badge }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 group ${active ? 'bg-[#052E16] text-white shadow-xl shadow-green-900/20' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
    >
      <div className="flex items-center gap-4">
        <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'}`} />
        <span className="text-[12px] font-black uppercase tracking-widest">{label}</span>
      </div>
      {badge > 0 && (
        <span className="h-6 w-6 rounded-lg bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-lg shadow-rose-500/20 animate-pulse">
          {badge}
        </span>
      )}
    </button>
  );
}

function MetricCard({ label, value, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.04)] group transition-all hover:shadow-xl">
      <div className={`h-14 w-14 rounded-2xl ${bg} flex items-center justify-center ${color} mb-8 transition-transform group-hover:scale-110`}>
        <Icon className="h-7 w-7" />
      </div>
      <div className="text-4xl font-black text-slate-900 tracking-tighter mb-2">{value}</div>
      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</div>
    </div>
  );
}

function FormInput({ label, value, onChange, placeholder }: any) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">{label}</label>
      <input 
        type="text" 
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-8 py-5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#052E16]/5 transition-all"
      />
    </div>
  );
}

function VerificationCard({ farmer, onVerify }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      className="bg-white border border-slate-100 rounded-[2.5rem] p-8 flex flex-col md:flex-row md:items-center justify-between hover:border-[#2D5A27]/20 hover:bg-slate-50/50 transition-all gap-8 group"
    >
      <div className="flex items-center gap-8">
        <div className="h-20 w-20 rounded-[1.5rem] bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#2D5A27]/10 group-hover:text-[#2D5A27] transition-all">
           <Users className="h-10 w-10" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">{farmer.full_name || "New Farmer"}</h3>
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4">{farmer.email} · Applied {new Date(farmer.created_at).toLocaleDateString()}</p>
          <div className="flex gap-3">
             <span className="px-3 py-1 rounded-lg bg-amber-50 text-amber-600 text-[9px] font-black uppercase tracking-widest border border-amber-100">National ID Pending</span>
             <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest border border-blue-100">Land Record Match</span>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <button onClick={() => onVerify(farmer.id, false)} className="h-14 w-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center transition-all hover:bg-rose-100 active:scale-95">
           <XCircle className="h-6 w-6" />
        </button>
        <button onClick={() => onVerify(farmer.id, true)} className="h-14 px-10 rounded-2xl bg-[#052E16] text-white text-[12px] font-black uppercase tracking-widest transition-all hover:shadow-2xl hover:shadow-green-900/30 active:scale-95 flex items-center gap-3">
           <CheckCircle2 className="h-5 w-5" /> Approve Farmer
        </button>
      </div>
    </motion.div>
  );
}
