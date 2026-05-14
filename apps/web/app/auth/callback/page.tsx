"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        router.push("/onboarding");
      }
    });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="text-center">
        <div className="h-12 w-12 border-4 border-[#2D5A27] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Authenticating...</h2>
        <p className="text-slate-400 text-sm font-medium">Please wait while we sync your secure session.</p>
      </div>
    </div>
  );
}
