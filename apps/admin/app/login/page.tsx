"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Mail, Lock, ArrowRight, Globe } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const user = data.user;
      if (!user) throw new Error("Unable to load admin session.");

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      const role = profile?.role || user.user_metadata?.role;
      if (role !== "admin") {
        await supabase.auth.signOut();
        throw new Error("This account does not have admin access.");
      }

      toast.success("Admin access granted!");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
      <div className="hidden lg:flex flex-col justify-between bg-[#052E16] text-white p-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.12),_transparent_36%)]" />
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-16">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter">AgriAdmin</span>
          </Link>

          <h1 className="text-5xl font-black tracking-tighter leading-none max-w-md mb-6">
            Sign in to the Command Center.
          </h1>
          <p className="max-w-md text-green-100/70 text-lg leading-relaxed">
            Access the national dashboard, farmer verification queue, disease library, and outbreak intelligence.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 text-xs font-black uppercase tracking-widest text-green-200/70">
          <Globe className="h-4 w-4" />
          Separate admin origin with local session storage
        </div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-10 text-[#052E16]">
            <ShieldCheck className="h-6 w-6" />
            <span className="text-xl font-black tracking-tighter">AgriAdmin</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-2xl shadow-slate-200/50">
            <div className="mb-8">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Admin Login</p>
              <h2 className="text-3xl font-black tracking-tighter text-slate-900">Welcome Back</h2>
              <p className="mt-3 text-sm font-medium text-slate-500 leading-relaxed">
                Sign in with an authorized account to open the Command Center.
              </p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-[#052E16]/10 focus:border-[#052E16] text-sm font-bold text-slate-700"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-[#052E16]/10 focus:border-[#052E16] text-sm font-bold text-slate-700"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-[#052E16] text-white font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#064E3B] transition-all shadow-xl shadow-green-950/20 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Sign In to Admin"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <p className="mt-6 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
              Only admin profiles can access this portal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}