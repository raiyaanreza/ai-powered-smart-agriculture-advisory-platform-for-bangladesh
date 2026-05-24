"use client";
import { ShieldCheck, Users, Terminal, Bell, LayoutDashboard, Database, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import dynamic from "next/dynamic";

// Modular Feature Imports
import { Navbar } from "@/features/common/components/Layout";
import { SidebarLink } from "@/features/common/components/SidebarLink";

const OverviewTab = dynamic(
  () => import("@/features/overview/components/OverviewTab").then((mod) => ({ default: mod.OverviewTab })),
  { loading: () => <div className="h-96 rounded-3xl bg-slate-100 animate-pulse" /> }
);

const VerificationTab = dynamic(
  () => import("@/features/verification/components/VerificationTab").then((mod) => ({ default: mod.VerificationTab })),
  { loading: () => <div className="h-96 rounded-3xl bg-slate-100 animate-pulse" /> }
);

const AlertsTab = dynamic(
  () => import("@/features/monitoring/components/AlertsTab").then((mod) => ({ default: mod.AlertsTab })),
  { loading: () => <div className="h-96 rounded-3xl bg-slate-100 animate-pulse" /> }
);

const SystemTab = dynamic(
  () => import("@/features/monitoring/components/SystemTab").then((mod) => ({ default: mod.SystemTab })),
  { loading: () => <div className="h-96 rounded-3xl bg-slate-100 animate-pulse" /> }
);

type Tab = "overview" | "verification" | "library" | "alerts" | "system";

export default function AdminDashboard() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [pendingFarmers, setPendingFarmers] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
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
      fetchAdminData();
    }
  }, [profile, user, loading, router]);

  const fetchAdminData = async () => {
    setFetching(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || "admin-mock-token";

      const response = await fetch("/api/admin/farmers", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPendingFarmers(data.pendingFarmers || []);
        setDashboardMetrics(prev => ({
          ...prev,
          totalUsers: data.totalUsers || 0,
          diagnosesCount: data.diagnosesCount || 0
        }));
      }
    } catch (err) {
      console.error("Error loading administrative data:", err);
      toast.error("Failed to load dashboard metrics");
    } finally {
      setFetching(false);
    }
  };

  const handleVerify = async (id: string, approve: boolean) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || "admin-mock-token";

      const response = await fetch("/api/admin/farmers", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ farmerId: id, approve })
      });
      
      if (response.ok) {
        toast.success(approve ? "Farmer approved successfully" : "Application rejected");
        setPendingFarmers(prev => prev.filter(f => f.id !== id));
        // Refresh stats
        const refreshResponse = await fetch("/api/admin/farmers", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          setDashboardMetrics(prev => ({
            ...prev,
            totalUsers: data.totalUsers || 0,
            diagnosesCount: data.diagnosesCount || 0
          }));
        }
      } else {
        toast.error("Verification sync failed");
      }
    } catch (err) {
      console.error("Error during farmer verification:", err);
      toast.error("Verification sync failed");
    }
  };

  const handleBroadcast = async () => {
    if (!alertForm.title || !alertForm.message) {
      toast.error("Required fields missing");
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || "admin-mock-token";

      const response = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: alertForm.title,
          message: alertForm.message,
          type: alertForm.type,
          target: alertForm.target
        })
      });

      if (response.ok) {
        toast.success("National Broadcast sent successfully!");
        setAlertForm({ title: "", type: "Critical", target: "All Users", message: "" });
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to issue broadcast");
      }
    } catch (err) {
      console.error("Error during alert broadcast:", err);
      toast.error("Failed to issue broadcast");
    }
  };

  if (loading || !user || profile?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-[#052E16] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium text-slate-500">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <Navbar />
      
      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`w-56 bg-card border-r border-border fixed lg:sticky top-14 h-[calc(100vh-56px)] overflow-y-auto z-45 transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <div className="p-3">
            {/* Mobile Close Button */}
            <div className="lg:hidden flex items-center justify-between mb-3 pb-3 border-b border-border">
              <span className="text-sm font-semibold text-foreground">Navigation</span>
              <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-md hover:bg-muted">
                <X className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              </button>
            </div>

            {/* System Status */}
            <div className="mb-4 p-3 rounded-lg bg-background border border-border">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-450 uppercase tracking-wide">System Status</span>
              </div>
              <div className="text-sm font-bold text-foreground">99.8% Online</div>
              <div className="mt-2 h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "99.8%" }} />
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              <SidebarLink active={activeTab === "overview"} onClick={() => { setActiveTab("overview"); setSidebarOpen(false); }} icon={LayoutDashboard} label="Global Overview" />
              <SidebarLink active={activeTab === "verification"} onClick={() => { setActiveTab("verification"); setSidebarOpen(false); }} icon={Users} label="Farmer Verification" badge={pendingFarmers.length || 0} />
              <SidebarLink active={activeTab === "alerts"} onClick={() => { setActiveTab("alerts"); setSidebarOpen(false); }} icon={Bell} label="National Alerts" />
              <SidebarLink active={activeTab === "system"} onClick={() => { setActiveTab("system"); setSidebarOpen(false); }} icon={Terminal} label="System Engine" />
            </nav>
          </div>

          {/* Bottom Section */}
          <div className="p-3 border-t border-border">
            <div className="p-3 rounded-lg bg-background border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-3.5 w-3.5 text-slate-400 dark:text-slate-550" />
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-450">Database</span>
              </div>
              <div className="text-xs font-medium text-slate-700 dark:text-slate-300">PostgreSQL 18</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500">Connected</div>
            </div>
          </div>
        </aside>

        {/* Main Workspace */}
        <main id="main-content" role="main" className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full bg-[#052E16] text-white shadow-lg flex items-center justify-center hover:bg-[#064E3B] transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

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
