"use client";
import { Navbar, Footer } from "@/features/common/components/Layout";
import { 
  ShieldCheck, CheckCircle2, XCircle, Users, Activity, 
  AlertTriangle, LayoutDashboard, Database, Bell, 
  TrendingUp, Map as MapIcon, Plus, Save, Trash2, 
  Search, FileJson, ChevronRight, Globe
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
    <div className="h-125 w-full rounded-[2.5rem] bg-slate-100 animate-pulse flex items-center justify-center">
      <div className="text-xs font-black uppercase tracking-widest text-slate-400">Initializing GIS Module...</div>
    </div>
  )
});

type Tab = "overview" | "verification" | "library" | "alerts";

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
    accuracy: 0,
    trend: [0, 0, 0, 0, 0, 0, 0],
  });
  const [recentAlerts, setRecentAlerts] = useState<any[]>([]);
  
  // New Disease Form State
  const [newDisease, setNewDisease] = useState<Partial<Disease>>({
    name: "",
    nameBn: "",
    crop: "Rice",
    type: "Fungal",
    severity: "Medium",
    symptoms: [""],
    management: [""],
    description: ""
  });

  useEffect(() => {
    const userRole = profile?.role || user?.user_metadata?.role;
    if (userRole === "admin") {
      fetchPending();
      fetchDashboardAnalytics();
      fetchLibraryDiseases();
      
      const channel = supabase
        .channel('admin-profiles')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'profiles' }, 
          (payload) => {
            fetchPending(); // Refresh list on any change
            if (payload.eventType === 'INSERT' && payload.new.role === 'farmer') {
              toast.info(`New Farmer Application: ${payload.new.email}`);
            }
          }
        ).subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [profile, user, loading, router]);

  const fetchPending = async () => {
    setFetching(true);
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("role", "farmer")
      .eq("is_verified", false);
    
    if (data) setPendingFarmers(data);
    setFetching(false);
  };

  const handleVerify = async (id: string, approve: boolean) => {
    const { error } = await supabase
      .from("profiles")
      .update({ 
        is_verified: approve,
        role: approve ? "farmer" : "user"
      })
      .eq("id", id);
      
    if (!error) {
      toast.success(approve ? "Approved!" : "Rejected.");
      setPendingFarmers(prev => prev.filter(f => f.id !== id));
    } else {
      toast.error("Operation failed.");
    }
  };

  const [alertForm, setAlertForm] = useState({
    title: "",
    type: "Info",
    target: "All Users",
    message: ""
  });

  const handleBroadcast = async () => {
    if (!alertForm.title || !alertForm.message) {
      toast.error("Please fill all fields");
      return;
    }

    const { error } = await supabase
      .from("notifications")
      .insert([{
        title: alertForm.title,
        message: alertForm.message,
        type: alertForm.type.toLowerCase().split(' ')[0],
        target_role: alertForm.target === "All Users" ? "all" : alertForm.target === "Farmers Only" ? "farmer" : "user"
      }]);

    if (!error) {
      toast.success("Broadcast successful!");
      setAlertForm({ title: "", type: "Info", target: "All Users", message: "" });
    } else {
      toast.error("Failed to broadcast. Ensure 'notifications' table exists.");
    }
  };

  const handleAddDisease = async () => {
    const id = newDisease.name?.toLowerCase().replace(/\s+/g, '-') || Date.now().toString();
    const diseaseToAdd = { ...newDisease, id } as Disease;
    
    const { error } = await supabase.from("diseases").insert([diseaseToAdd]);
    
    if (!error) {
      await fetchLibraryDiseases();
      setShowAddDisease(false);
      setNewDisease({
        name: "", nameBn: "", crop: "Rice", type: "Fungal", severity: "Medium",
        symptoms: [], management: [], image: ""
      });
      toast.success("Disease added to library!");
    } else {
      console.error("DB Error:", error);
      toast.error("Failed to sync with library. Local update only.");
      // Fallback to local
      setDiseases([diseaseToAdd, ...diseases]);
      setShowAddDisease(false);
    }
  };

  const fetchLibraryDiseases = async () => {
    const { data } = await supabaseAdmin
      .from("diseases")
      .select("*");

    if (data && data.length > 0) {
      const remoteDiseases = data as Disease[];
      const seenIds = new Set(remoteDiseases.map((disease) => disease.id));
      setDiseases([...remoteDiseases, ...initialDiseases.filter((disease) => !seenIds.has(disease.id))]);
    } else {
      setDiseases(initialDiseases);
    }
  };

  const fetchDashboardAnalytics = async () => {
    const [profilesResult, diagnosesResult, notificationsResult] = await Promise.all([
      supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }),
      supabaseAdmin
        .from("diagnoses")
        .select("confidence_score, created_at", { count: "exact" })
        .order("created_at", { ascending: false })
        .limit(200),
      supabaseAdmin
        .from("notifications")
        .select("id, title, message, type, created_at")
        .order("created_at", { ascending: false })
        .limit(3),
    ]);

    const diagnoses = diagnosesResult.data || [];
    const windowStart = new Date();
    windowStart.setHours(0, 0, 0, 0);

    const trend = Array.from({ length: 7 }, (_, index) => {
      const day = new Date(windowStart);
      day.setDate(day.getDate() - (6 - index));
      const dayStart = day.getTime();
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;
      return diagnoses.filter((item) => {
        if (!item.created_at) return false;
        const createdAt = new Date(item.created_at).getTime();
        return createdAt >= dayStart && createdAt < dayEnd;
      }).length;
    });

    const accuracy = diagnoses.length > 0
      ? diagnoses.reduce((sum, item) => sum + (typeof item.confidence_score === "number" ? item.confidence_score : 0), 0) / diagnoses.length
      : 0;

    setDashboardMetrics({
      totalUsers: profilesResult.count ?? 0,
      diagnosesCount: diagnosesResult.count ?? diagnoses.length,
      accuracy: accuracy * 100,
      trend,
    });

    setRecentAlerts((notificationsResult.data || []).map((notification) => ({
      ...notification,
      time: new Date(notification.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    })));
  };

  const userRole = profile?.role || user?.user_metadata?.role;
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
             <div className="h-12 w-12 rounded-full border-4 border-green-900/10 border-t-green-900 animate-spin" />
             <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Command Center...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!user && !loading) {
    // ...
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-8">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-[3rem] p-12 text-center shadow-2xl shadow-slate-200/50">
          <div className="h-20 w-20 rounded-full bg-slate-50 mx-auto flex items-center justify-center mb-8">
            <ShieldCheck className="h-10 w-10 text-slate-300" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">Command Center</h1>
          <p className="text-slate-500 font-medium leading-relaxed mb-8">
            Administrative access required. Please sign in with an authorized account to access monitoring tools.
          </p>
          <button 
            onClick={() => window.location.href = "/login"}
            className="w-full h-14 rounded-2xl bg-[#052E16] text-white font-black text-xs uppercase tracking-widest hover:bg-black transition-all"
          >
            Sign In to Admin
          </button>
        </div>
      </div>
    );
  }

  if (userRole !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-8">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-[3rem] p-12 text-center shadow-2xl shadow-slate-200/50">
          <div className="h-20 w-20 rounded-full bg-red-50 mx-auto flex items-center justify-center mb-8">
            <ShieldCheck className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">Unauthorized Access</h1>
          <p className="text-slate-500 font-medium leading-relaxed mb-8">
            You do not have administrative privileges to access the Command Center. Please return to the public platform.
          </p>
          <button 
            onClick={() => window.location.href = "http://localhost:3000"}
            className="w-full h-14 rounded-2xl bg-[#052E16] text-white font-black text-xs uppercase tracking-widest hover:bg-black transition-all"
          >
            Go to Public Site
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <Navbar />
      
      <div className="flex-1 flex flex-col lg:flex-row max-w-400 w-full mx-auto p-4 lg:p-8 gap-8">
        
        {/* Sidebar */}
        <aside className="w-full lg:w-72 flex flex-col gap-2">
          <div className="p-6 bg-white border border-slate-200 rounded-4xl shadow-sm mb-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-[#052E16] flex items-center justify-center shadow-lg shadow-green-900/20">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Admin Panel</div>
                <div className="text-sm font-black text-slate-900 truncate max-w-30">{user?.email?.split('@')[0]}</div>
              </div>
            </div>
            
            <nav className="space-y-1">
              <SidebarLink 
                active={activeTab === "overview"} 
                onClick={() => setActiveTab("overview")} 
                icon={LayoutDashboard} 
                label="Overview" 
              />
              <SidebarLink 
                active={activeTab === "verification"} 
                onClick={() => setActiveTab("verification")} 
                icon={Users} 
                label="Farmer Verification" 
                badge={pendingFarmers.length > 0 ? pendingFarmers.length : undefined}
              />
              <SidebarLink 
                active={activeTab === "library"} 
                onClick={() => setActiveTab("library")} 
                icon={Database} 
                label="Disease Library" 
              />
              <SidebarLink 
                active={activeTab === "alerts"} 
                onClick={() => setActiveTab("alerts")} 
                icon={Bell} 
                label="National Alerts" 
              />
            </nav>
          </div>

          <div className="p-6 bg-linear-to-br from-green-950 to-[#1A3A1A] rounded-4xl shadow-xl text-white">
            <Activity className="h-6 w-6 text-green-400 mb-4" />
            <div className="text-xs font-bold text-green-200 uppercase tracking-widest mb-1">System Health</div>
            <div className="text-xl font-black mb-4 tracking-tighter">99.8% Online</div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-green-400 h-full w-[99.8%]" />
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Platform Analytics</h1>
                    <p className="text-slate-500 font-medium">Real-time insights into agricultural health and user activity.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="h-10 px-4 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-50 active:scale-95">
                      <FileJson className="h-4 w-4" /> Export Data
                    </button>
                    <button className="h-10 px-4 rounded-xl bg-[#052E16] text-white text-xs font-black flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-900 active:scale-95 shadow-lg shadow-green-900/10">
                      <Bell className="h-4 w-4" /> Issue Alert
                    </button>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard label="Total Users" value={dashboardMetrics.totalUsers.toLocaleString()} trend={dashboardMetrics.totalUsers > 0 ? `+${dashboardMetrics.totalUsers}` : "0"} icon={Users} color="blue" />
                  <StatCard label="Diagnoses" value={dashboardMetrics.diagnosesCount.toLocaleString()} trend={dashboardMetrics.diagnosesCount > 0 ? `+${dashboardMetrics.diagnosesCount}` : "0"} icon={Activity} color="green" />
                  <StatCard label="Accuracy" value={`${dashboardMetrics.accuracy.toFixed(1)}%`} trend={dashboardMetrics.accuracy > 0 ? `+${dashboardMetrics.accuracy.toFixed(1)}%` : "0"} icon={ShieldCheck} color="purple" />
                  <StatCard label="Pending" value={pendingFarmers.length.toString()} trend={pendingFarmers.length > 0 ? `+${pendingFarmers.length}` : "0"} icon={AlertTriangle} color="amber" />
                </div>

                {/* Map & Analytics Section */}
                <div className="grid grid-cols-1 gap-8">
                  {/* National Outbreak Map & Analytics (GIS) */}
                  <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="font-black text-slate-900 flex items-center gap-2">
                        <MapIcon className="h-5 w-5 text-blue-600" /> Outbreak Intelligence & Analytics
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Live Sync</span>
                      </div>
                    </div>
                    
                    <div className="w-full">
                      <OutbreakMap />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "verification" && (
              <motion.div 
                key="verification"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50"
              >
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-2xl font-black text-[#1A2E1A] tracking-tighter">Farmer Verification</h2>
                    <p className="text-slate-500 font-medium mt-1">Review and approve applications for the premium Farmer Dashboard.</p>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
                
                {fetching ? (
                  <div className="text-center py-20 text-slate-400 font-bold">Loading applications...</div>
                ) : pendingFarmers.length === 0 ? (
                  <div className="text-center py-32 border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                    <ShieldCheck className="h-16 w-16 text-slate-200 mx-auto mb-6" />
                    <div className="text-xl font-black text-slate-400">Zero Pending Applications</div>
                    <p className="text-slate-400 text-sm mt-2">All verification requests have been processed.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingFarmers.map(farmer => (
                      <VerificationCard key={farmer.id} farmer={farmer} onVerify={handleVerify} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "library" && (
              <motion.div 
                key="library"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Disease Library Management</h2>
                  <button 
                    onClick={() => setShowAddDisease(true)}
                    className="h-12 px-6 rounded-2xl bg-[#052E16] text-white text-xs font-black flex items-center gap-2 hover:bg-black transition-all shadow-xl shadow-green-900/10"
                  >
                    <Plus className="h-5 w-5" /> Add New Disease
                  </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden mb-8">
                  <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search disease library..." 
                        className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#052E16]/10 transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Disease Name</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Crop Type</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Severity</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {diseases.map(d => (
                          <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden">
                                  {d.image ? <img src={d.image} className="h-full w-full object-cover" alt="" /> : <Database className="h-4 w-4 text-slate-400" />}
                                </div>
                                <div>
                                  <div className="text-sm font-black text-slate-900">{d.name}</div>
                                  <div className="text-[10px] text-slate-400 font-bold">{d.nameBn}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest">{d.crop}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-xs font-bold text-slate-500">{d.type}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className={`flex items-center gap-1.5 ${
                                d.severity === 'High' ? 'text-red-600' : d.severity === 'Medium' ? 'text-amber-600' : 'text-green-600'
                              }`}>
                                <div className={`h-1.5 w-1.5 rounded-full ${
                                  d.severity === 'High' ? 'bg-red-600' : d.severity === 'Medium' ? 'bg-amber-600' : 'bg-green-600'
                                }`} />
                                <span className="text-xs font-black uppercase tracking-tighter">{d.severity}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><ChevronRight className="h-5 w-5" /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                       <Globe className="h-4 w-4 text-[#052E16]" /> Visual Reference Library (Rice)
                    </h3>
                  </div>
                  <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                    {diseases.filter(d => d.crop === "Rice").map(d => (
                      <div key={`ref-${d.id}`} className="group cursor-pointer">
                        <div className="aspect-square rounded-3xl overflow-hidden border border-slate-100 bg-slate-50 relative shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                           {d.image ? (
                             <img 
                               src={d.image} 
                               className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                               alt={d.name} 
                             />
                           ) : (
                             <div className="h-full w-full flex items-center justify-center text-slate-300">
                                <Database className="h-8 w-8" />
                             </div>
                           )}
                           <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                              <div className="text-[10px] font-black text-white uppercase tracking-widest leading-tight">{d.name}</div>
                              <div className="text-[8px] font-bold text-green-400 uppercase tracking-widest mt-1">Verified Expert Ref</div>
                           </div>
                        </div>
                        <div className="mt-3 px-1">
                           <div className="text-[11px] font-black text-slate-900 truncate">{d.name}</div>
                           <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{d.type}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "alerts" && (
              <motion.div 
                key="alerts"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter">National Alert System</h2>
                    <p className="text-slate-500 font-medium">Broadcast critical information to all users across the platform.</p>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
                    <Bell className="h-7 w-7 text-red-600" />
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50">
                    <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                      <Plus className="h-5 w-5 text-red-600" /> Compose New Alert
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Alert Title</label>
                          <input 
                            type="text" 
                            value={alertForm.title}
                            onChange={(e) => setAlertForm({ ...alertForm, title: e.target.value })}
                            placeholder="e.g. Cyclone Alert - Barisal Region" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-red-500/5 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Alert Type</label>
                          <select 
                            value={alertForm.type}
                            onChange={(e) => setAlertForm({ ...alertForm, type: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-none appearance-none"
                          >
                            <option>Critical (Emergency)</option>
                            <option>Warning (Precautionary)</option>
                            <option>Info (General Update)</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Target Audience</label>
                        <div className="flex gap-4">
                          {["All Users", "Farmers Only", "Standard Users"].map((role) => (
                            <button 
                              key={role} 
                              onClick={() => setAlertForm({ ...alertForm, target: role })}
                              className={`flex-1 h-12 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5 active:scale-95 ${
                                alertForm.target === role ? "bg-[#052E16] text-white border-[#052E16]" : "border-slate-200 text-slate-500 hover:border-[#052E16] hover:text-[#052E16]"
                              }`}
                            >
                              {role}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Detailed Message</label>
                        <textarea 
                          rows={4} 
                          value={alertForm.message}
                          onChange={(e) => setAlertForm({ ...alertForm, message: e.target.value })}
                          placeholder="Provide detailed instructions for the target group..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-red-500/5 transition-all resize-none"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500" />
                          <span className="text-xs font-bold text-slate-500">Send as push notification</span>
                        </div>
                        <button 
                          onClick={handleBroadcast}
                          className="h-14 px-10 rounded-2xl bg-red-600 text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-700 active:scale-95 shadow-xl shadow-red-600/20"
                        >
                          <Bell className="h-5 w-5" /> Broadcast Now
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                      <Activity className="h-4 w-4 text-red-600" /> Active Alerts ({recentAlerts.length})
                    </h3>
                    
                    <div className="space-y-4">
                      {recentAlerts.length === 0 ? (
                        <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                          No active alerts yet.
                        </div>
                      ) : recentAlerts.map((alert, i) => (
                        <div key={alert.id || i} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-start justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                          <div className="flex gap-4">
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                              alert.type === "critical" ? "bg-red-50 text-red-600" : alert.type === "warning" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                            }`}>
                              <AlertTriangle className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="text-sm font-black text-slate-900">{alert.title}</div>
                              <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{alert.time} • {alert.type}</div>
                            </div>
                          </div>
                          <button className="text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:text-red-500 active:scale-95">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Add Disease Modal */}
      <AnimatePresence>
        {showAddDisease && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddDisease(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Add New Disease Entry</h2>
                  <p className="text-slate-500 text-sm font-medium">Create a new expert-verified entry for the national library.</p>
                </div>
                <button onClick={() => setShowAddDisease(false)} className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 hover:rotate-90 transition-all">
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <FormInput label="Common Name (English)" value={newDisease.name} onChange={(v: string) => setNewDisease({...newDisease, name: v})} placeholder="e.g. Leaf Blast" />
                  <FormInput label="Scientific/Bangla Name" value={newDisease.nameBn} onChange={(v: string) => setNewDisease({...newDisease, nameBn: v})} placeholder="ধনের ব্লাস্ট রোগ" />
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Affected Crop</label>
                    <select 
                      value={newDisease.crop} 
                      onChange={e => setNewDisease({...newDisease, crop: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#052E16]/5 transition-all appearance-none"
                    >
                      <option>Rice</option>
                      <option>Wheat</option>
                      <option>Potato</option>
                      <option>Corn</option>
                      <option>Brassica</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Disease Type</label>
                    <select 
                      value={newDisease.type} 
                      onChange={e => setNewDisease({...newDisease, type: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#052E16]/5 transition-all appearance-none"
                    >
                      <option>Fungal</option>
                      <option>Bacterial</option>
                      <option>Viral</option>
                      <option>Pest</option>
                      <option>Nutritional</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Disease Description</label>
                  <textarea 
                    rows={4} 
                    value={newDisease.description}
                    onChange={e => setNewDisease({...newDisease, description: e.target.value})}
                    placeholder="Provide a detailed description of the disease..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#052E16]/5 transition-all resize-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Symptoms (One per line)</label>
                      <textarea 
                        rows={4} 
                        onChange={e => setNewDisease({...newDisease, symptoms: e.target.value.split('\n')})}
                        placeholder="Visible signs..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#052E16]/5 transition-all resize-none"
                      />
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Management (One per line)</label>
                      <textarea 
                        rows={4} 
                        onChange={e => setNewDisease({...newDisease, management: e.target.value.split('\n')})}
                        placeholder="Treatment steps..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#052E16]/5 transition-all resize-none"
                      />
                   </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <button className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
                  <FileJson className="h-4 w-4" /> Import from JSON
                </button>
                <div className="flex gap-4">
                  <button onClick={() => setShowAddDisease(false)} className="h-14 px-8 rounded-2xl text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all">Cancel</button>
                  <button 
                    onClick={handleAddDisease}
                    className="h-14 px-10 rounded-2xl bg-[#052E16] text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all shadow-2xl shadow-green-900/20"
                  >
                    <Save className="h-5 w-5" /> Save to Platform
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

function SidebarLink({ active, onClick, icon: Icon, label, badge }: { active: boolean, onClick: () => void, icon: any, label: string, badge?: number }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 ${
        active ? "bg-[#052E16]/5 text-[#052E16] ring-1 ring-[#052E16]/10" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`h-5 w-5 ${active ? "text-[#052E16]" : "text-slate-400"}`} />
        <span className="text-sm font-black tracking-tight">{label}</span>
      </div>
      {badge && (
        <span className="h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shadow-lg shadow-red-500/20">
          {badge}
        </span>
      )}
    </button>
  );
}

function StatCard({ label, value, trend, icon: Icon, color }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    amber: "bg-amber-50 text-amber-600",
  };
  
  return (
    <div className="bg-white border border-slate-200 rounded-4xl p-6 shadow-sm hover:border-[#052E16]/20 transition-all group">
      <div className={`h-12 w-12 rounded-2xl ${colors[color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="text-3xl font-black text-slate-900 mb-1 tracking-tighter">{value}</div>
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</div>
        <div className={`text-[10px] font-black px-2 py-0.5 rounded-full ${trend.includes('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {trend}
        </div>
      </div>
    </div>
  );
}

function VerificationCard({ farmer, onVerify }: any) {
  const appData = farmer.application_data || {};
  return (
    <div className="group border border-slate-100 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between hover:border-slate-200 hover:bg-slate-50/50 transition-all gap-6">
      <div className="flex items-center gap-6">
        <div className="h-16 w-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:rotate-3 transition-transform">
          <div className="h-10 w-10 rounded-full bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center">
             <Users className="h-5 w-5 text-slate-400" />
          </div>
        </div>
        <div>
          <div className="text-lg font-black text-slate-900 tracking-tight">{farmer.full_name || farmer.email}</div>
          <div className="text-xs text-slate-500 mt-2 flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="flex items-center gap-2"><MapIcon className="h-3.5 w-3.5 text-[#052E16]" /> <b>{appData.location || "N/A"}</b></span>
            <span className="flex items-center gap-2"><LayoutDashboard className="h-3.5 w-3.5 text-[#052E16]" /> <b>{appData.farmSize || "N/A"} Acres</b></span>
            <span className="flex items-center gap-2"><Activity className="h-3.5 w-3.5 text-[#052E16]" /> <b>{appData.crop || "N/A"}</b></span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={() => onVerify(farmer.id, false)}
          className="h-12 px-6 rounded-2xl bg-white border border-red-100 text-red-500 text-xs font-black uppercase tracking-widest hover:bg-red-50 transition-colors"
        >
          Reject
        </button>
        <button 
          onClick={() => onVerify(farmer.id, true)}
          className="h-12 px-8 rounded-2xl bg-[#052E16] text-white text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-green-950/20"
        >
          Approve Access
        </button>
      </div>
    </div>
  );
}

function FormInput({ label, value, onChange, placeholder, type = "text" }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">{label}</label>
      <input 
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#052E16]/5 transition-all"
      />
    </div>
  );
}
