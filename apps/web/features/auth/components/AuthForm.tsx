"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Lock, 
  User, 
  LogIn, 
  ArrowRight
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type AuthMode = "login" | "signup";

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("login"); // Default to login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        });
        if (error) throw error;
        
        // Auto-login or wait for confirmation
        toast.success("Account created successfully!");
        router.push("/onboarding");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Successfully logged in!");
        router.push("/onboarding"); // Onboarding page will redirect to dashboard if already complete
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback` // callback will handle redirect to onboarding
      }
    });
    if (error) toast.error(error.message);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-2xl shadow-slate-200/50">
        <div className="text-center mb-8">
           <h2 className="text-3xl font-black text-[#1A2E1A] tracking-tighter mb-2">
             {mode === "login" ? "Welcome Back" : "Join AgriVision"}
           </h2>
           <p className="text-slate-400 text-sm font-medium">
             {mode === "login" ? "Sign in to access your farm analytics" : "The national agricultural intelligence network"}
           </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {mode === "signup" && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Full Name" 
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-[#2D5A27]/20 focus:border-[#2D5A27] transition-all text-sm font-bold text-slate-700"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="email" 
              placeholder="Email Address" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-[#2D5A27]/20 focus:border-[#2D5A27] transition-all text-sm font-bold text-slate-700"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="password" 
              placeholder="Password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-[#2D5A27]/20 focus:border-[#2D5A27] transition-all text-sm font-bold text-slate-700"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 rounded-xl bg-[#052E16] text-white font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#1A321A] transition-all shadow-xl shadow-green-950/20 active:scale-95 disabled:opacity-50 mt-6"
          >
            {loading ? "Processing..." : mode === "login" ? "Sign In" : "Register"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="relative my-8">
           <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
           <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-slate-300"><span className="bg-white px-4">Or continue with</span></div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="w-full h-12 rounded-xl bg-white border border-slate-200 text-slate-600 font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-95"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12.48 10.92v3.28h7.84c-.24 1.84-.909 3.292-2.09 4.313-1.442 1.236-3.262 1.947-5.75 1.947-4.832 0-8.832-3.262-10.288-7.613l-.014-.047-.021-.061c-.015-.045-.028-.091-.039-.138l-.014-.061-.005-.028c-.287-1.3-.287-2.652 0-3.952l.005-.028.014-.061c.011-.047.024-.093.039-.138l.021-.061.014-.047c1.456-4.351 5.456-7.613 10.288-7.613 2.652 0 4.887 1.053 6.643 2.809l2.45-2.45c-2.822-2.822-6.577-4.444-9.093-4.444-6.39 0-11.83 4.24-13.62 10.15l13.62 0z"/>
            <path fill="#4285F4" d="M23.49 12.275c0-.853-.075-1.675-.213-2.475H12.48v4.688h6.188c-.263 1.413-1.063 2.613-2.263 3.413v2.838h3.663c2.138-1.975 3.375-4.888 3.375-8.463z"/>
            <path fill="#34A853" d="M12.48 23.5c3.105 0 5.711-1.029 7.613-2.787l-3.663-2.838c-1.029.688-2.338 1.101-3.95 1.101-3.038 0-5.612-2.05-6.525-4.813H2.213v2.925c1.901 3.75 5.788 6.412 10.267 6.412z"/>
            <path fill="#FBBC05" d="M5.955 14.163c-.238-.688-.375-1.425-.375-2.188s.138-1.5.375-2.188V6.862H2.213C1.388 8.412.925 10.162.925 12s.463 3.588 1.288 5.138l3.742-2.975z"/>
          </svg>
          Google
        </button>

        <div className="mt-8 text-center">
           <button 
             onClick={() => setMode(mode === "login" ? "signup" : "login")}
             className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
           >
             {mode === "login" ? "Don't have an account? Register" : "Already have an account? Sign In"}
           </button>
        </div>
      </div>
    </div>
  );
}
