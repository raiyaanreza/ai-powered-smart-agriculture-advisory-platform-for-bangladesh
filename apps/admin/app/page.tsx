"use client";
import { Navbar } from "@/features/common/components/Layout";
import { ShieldCheck, Users, Terminal, Bell, LayoutDashboard, Database } from "lucide-react";
import { useState, useEffect } from "react";
import { supabaseAdmin } from "@/lib/supabase";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";

// Modular Feature Imports
import { SidebarLink } from "@/features/common/components/SidebarLink";
import { OverviewTab } from "@/features/overview/components/OverviewTab";
import { VerificationTab } from "@/features/verification/components/VerificationTab";
import { AlertsTab } from "@/features/monitoring/components/AlertsTab";
import { SystemTab } from "@/features/monitoring/components/SystemTab";

type Tab = "overview" | "verification" | "library" | "alerts" | "system";

export default function AdminDashboard() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [pendingFarmers, setPendingFarmers] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  
  const [dashboardMetrics, setDashboardMetrics] = useState({
    totalUsers: 0,
    diagnosesCount: 0,
    accuracy: 99.2,
    activeAlerts: 3
  });

  const [alertForm, setAlertForm] = useState({
    title: "",
    type: "Critical",
    target: "All Users",
    message: ""
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

  const handleBroadcast = async () => {
    if (!alertForm.title || !alertForm.message) {
      toast.error("Required fields missing");
      return;
    }

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
            <SidebarLink active={activeTab === "alerts"} onClick={() => setActiveTab("alerts")} icon={Bell} label="National Alerts" />
            <SidebarLink active={activeTab === "system"} onClick={() => setActiveTab("system")} icon={Terminal} label="System Engine" />
          </nav>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 p-8 lg:p-14 overflow-x-hidden">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <OverviewTab metrics={dashboardMetrics} />
            )}

            {activeTab === "verification" && (
              <VerificationTab pendingFarmers={pendingFarmers} onVerify={handleVerify} fetching={fetching} />
            )}

            {activeTab === "alerts" && (
              <AlertsTab alertForm={alertForm} onChangeForm={setAlertForm} onBroadcast={handleBroadcast} />
            )}

            {activeTab === "system" && (
              <SystemTab />
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
