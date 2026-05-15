"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout, User as UserIcon, ShieldCheck, ArrowRight, CheckCircle2, FlaskConical } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useAuth, UserRole } from "@/features/auth/hooks/useAuth";
import { toast } from "sonner";

export default function OnboardingPage() {
  const { user, profile, loading } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [step, setStep] = useState<"role" | "questions">("role");
  const adminAppUrl = process.env.NEXT_PUBLIC_ADMIN_APP_URL || "http://localhost:3001";

  // Questionnaire state
  const [farmSize, setFarmSize] = useState("");
  const [location, setLocation] = useState("");
  const [crop, setCrop] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
        return;
      }

      // Check if user has already completed onboarding
      const hasCompletedOnboarding =
        profile?.onboarding_completed ||
        user?.user_metadata?.onboarding_completed;

      if (hasCompletedOnboarding) {
        const role = profile?.role || user?.user_metadata?.role || "user";
        let dest = "/";
        if (role === "admin") {
          window.location.href = adminAppUrl;
          return;
        }
        else if (role === "farmer") dest = "/farmer";
        router.push(dest);
        return;
      }

      // If user has an existing role set (e.g., admin was assigned), skip onboarding
      const existingRole = profile?.role || user?.user_metadata?.role;
      if (existingRole === "admin") {
        window.location.href = adminAppUrl;
      }
    }
  }, [user, profile, loading, router]);

  const handleComplete = async (selectedRole: UserRole, autoVerify = false) => {
    if (!user) return;
    setSubmitting(true);

    try {
      const updates = {
        id: user.id,
        role: selectedRole,
        full_name: profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0],
        is_verified: autoVerify || selectedRole === "user" || selectedRole === "admin" ? true : false,
        onboarding_completed: true,
        application_data: selectedRole === "farmer" ? { farmSize, location, crop } : null
      };

      const { error } = await supabase.from("profiles").upsert(updates);
      if (error) {
        console.warn("Profile upsert failed (possibly RLS), continuing with auth update:", error.message);
        toast.warning("Profile sync delayed, but continuing setup...");
      }

      await supabase.auth.updateUser({
        data: { role: updates.role, onboarding_completed: true }
      });

      toast.success(autoVerify ? "Action successful!" : "Onboarding complete!");

      // Determine destination
      let dest = "/";
      if (selectedRole === "admin") {
        window.location.href = adminAppUrl;
        return;
      }
      else if (selectedRole === "farmer") dest = "/farmer";

      router.push(dest);
    } catch (err: any) {
      toast.error(err.message || "Failed to complete onboarding.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-[#1A2E1A] tracking-tighter mb-4">Welcome to AgriVision</h1>
          <p className="text-slate-500 font-medium">Let's set up your profile. How will you use the platform?</p>
        </div>

        <AnimatePresence mode="wait">
          {step === "role" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-3 gap-6"
            >
              <button
                onClick={() => handleComplete("user")}
                className="bg-white p-6 rounded-[2rem] border border-slate-200 text-left hover:border-[#2D5A27] hover:shadow-2xl hover:shadow-green-900/10 transition-all group"
              >
                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center mb-6 group-hover:bg-green-50 transition-colors">
                  <UserIcon className="h-5 w-5 text-slate-400 group-hover:text-[#2D5A27]" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">User</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-6">Access the library and AI scans.</p>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-300 flex items-center gap-2">
                  Instant <ArrowRight className="h-3 w-3" />
                </div>
              </button>

              <button
                onClick={() => { setRole("farmer"); setStep("questions"); }}
                className="bg-[#052E16] p-6 rounded-[2rem] border border-[#052E16] text-left hover:bg-[#064E3B] hover:shadow-2xl hover:shadow-green-950/20 transition-all group"
              >
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center mb-6">
                  <Layout className="h-5 w-5 text-green-400" />
                </div>
                <h3 className="text-lg font-black text-white mb-2">Farmer</h3>
                <p className="text-green-100/60 text-xs leading-relaxed mb-6">Dashboard & Advisory access.</p>
                <div className="text-[10px] font-black uppercase tracking-widest text-green-400 flex items-center gap-2">
                  Verify <ArrowRight className="h-3 w-3" />
                </div>
              </button>

              <button
                onClick={() => handleComplete("admin", true)}
                className="bg-red-50 p-6 rounded-[2rem] border border-red-100 text-left hover:border-red-500 hover:shadow-2xl hover:shadow-red-900/10 transition-all group"
              >
                <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center mb-6 group-hover:bg-red-500 transition-colors">
                  <ShieldCheck className="h-5 w-5 text-red-500 group-hover:text-white" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">Admin</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-6">Platform management console.</p>
                <div className="text-[10px] font-black uppercase tracking-widest text-red-500 flex items-center gap-2">
                  Staff Only <ArrowRight className="h-3 w-3" />
                </div>
              </button>
            </motion.div>
          )}

          {step === "questions" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50"
            >
              <div className="flex items-center gap-3 mb-8">
                <button onClick={() => setStep("role")} className="text-slate-400 hover:text-slate-900 font-bold text-sm">← Back</button>
                <h2 className="text-2xl font-black text-[#1A2E1A] tracking-tighter">Farmer Verification</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Farm Location (Division/District)</label>
                  <input
                    type="text"
                    value={location} onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Rajshahi"
                    className="w-full h-14 px-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-[#2D5A27] font-bold text-slate-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Farm Size (Acres)</label>
                    <input
                      type="number"
                      value={farmSize} onChange={(e) => setFarmSize(e.target.value)}
                      placeholder="e.g. 12"
                      className="w-full h-14 px-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-[#2D5A27] font-bold text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Primary Crop</label>
                    <input
                      type="text"
                      value={crop} onChange={(e) => setCrop(e.target.value)}
                      placeholder="e.g. Paddy"
                      className="w-full h-14 px-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-[#2D5A27] font-bold text-slate-700"
                    />
                  </div>
                </div>

                <div className="pt-6 flex flex-col gap-3">
                  <button
                    onClick={() => handleComplete("farmer", false)}
                    disabled={submitting || !location || !farmSize || !crop}
                    className="w-full h-14 rounded-2xl bg-[#052E16] text-white font-black text-[12px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#1A321A] transition-all disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit Application"}
                  </button>

                  {/* Test Feature */}
                  <button
                    onClick={() => handleComplete("farmer", true)}
                    disabled={submitting}
                    className="w-full h-14 rounded-2xl bg-amber-100 text-amber-700 font-black text-[12px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-amber-200 transition-all disabled:opacity-50"
                  >
                    <FlaskConical className="h-4 w-4" /> Auto-Verify (Test Mode)
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
