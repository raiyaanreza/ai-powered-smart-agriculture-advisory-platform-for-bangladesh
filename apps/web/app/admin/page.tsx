"use client";
import { Navbar, Footer } from "@/features/landing/components/Layout";
import { ShieldCheck, CheckCircle2, XCircle, Users, Activity, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [pendingFarmers, setPendingFarmers] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const userRole = profile?.role || user?.user_metadata?.role;
    if (!loading && userRole !== "admin") {
      router.push("/");
    } else if (userRole === "admin") {
      fetchPending();
    }
  }, [profile, user, loading, router]);

  const fetchPending = async () => {
    setFetching(true);
    // Fetch profiles where role is farmer and is_verified is false
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "farmer")
      .eq("is_verified", false);
    
    if (data) setPendingFarmers(data);
    setFetching(false);
  };

  const handleVerify = async (id: string, approve: boolean) => {
    if (approve) {
      const { error } = await supabase
        .from("profiles")
        .update({ is_verified: true })
        .eq("id", id);
      
      if (!error) {
        toast.success("Farmer application approved.");
        setPendingFarmers(prev => prev.filter(f => f.id !== id));
      } else {
        toast.error("Failed to approve.");
      }
    } else {
      // Rejecting could set role to 'user' or just delete application data
      const { error } = await supabase
        .from("profiles")
        .update({ role: "user", is_verified: true, application_data: null })
        .eq("id", id);
        
      if (!error) {
        toast.success("Farmer application rejected.");
        setPendingFarmers(prev => prev.filter(f => f.id !== id));
      }
    }
  };

  const userRole = profile?.role || user?.user_metadata?.role;
  if (loading || userRole !== "admin") return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-widest rounded-full w-fit mb-4">
              <ShieldCheck className="h-3 w-3" /> System Administrator
            </div>
            <h1 className="text-4xl font-black text-[#1A2E1A] tracking-tighter">Command Center</h1>
            <p className="text-slate-500 font-medium">Manage platform access, users, and national alerts.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
            <Users className="h-8 w-8 text-blue-500 mb-4" />
            <div className="text-3xl font-black text-slate-900 mb-1">1,240</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Registered Users</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
            <CheckCircle2 className="h-8 w-8 text-green-500 mb-4" />
            <div className="text-3xl font-black text-slate-900 mb-1">842</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verified Farmers</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
            <AlertTriangle className="h-8 w-8 text-amber-500 mb-4" />
            <div className="text-3xl font-black text-slate-900 mb-1">{pendingFarmers.length}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pending Verification</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50">
          <h2 className="text-xl font-black text-[#1A2E1A] mb-8">Pending Farmer Applications</h2>
          
          {fetching ? (
            <div className="text-center py-10 text-slate-400 font-bold text-sm">Loading applications...</div>
          ) : pendingFarmers.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-3xl">
              <ShieldCheck className="h-12 w-12 text-slate-200 mx-auto mb-4" />
              <div className="text-slate-500 font-bold">All caught up!</div>
              <div className="text-slate-400 text-sm">No pending applications at this time.</div>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingFarmers.map(farmer => {
                const appData = farmer.application_data || {};
                return (
                  <div key={farmer.id} className="border border-slate-100 rounded-3xl p-6 flex items-center justify-between hover:border-slate-200 transition-colors">
                    <div className="flex items-center gap-6">
                      <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center">
                        <Users className="h-5 w-5 text-slate-400" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900">{farmer.full_name || farmer.email}</div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-4">
                          <span><b className="text-slate-700">Location:</b> {appData.location || "N/A"}</span>
                          <span><b className="text-slate-700">Size:</b> {appData.farmSize || "N/A"} Acres</span>
                          <span><b className="text-slate-700">Crop:</b> {appData.crop || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleVerify(farmer.id, false)}
                        className="h-10 w-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleVerify(farmer.id, true)}
                        className="h-10 px-6 rounded-xl bg-[#2D5A27] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#1A321A] transition-all"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
