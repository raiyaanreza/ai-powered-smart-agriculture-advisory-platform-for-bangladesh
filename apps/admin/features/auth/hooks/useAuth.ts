"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export type UserRole = "user" | "farmer" | "expert" | "admin";

interface Profile {
  id: string;
  role: UserRole;
  full_name?: string;
  avatar_url?: string;
  is_verified?: boolean;
  onboarding_completed?: boolean;
  application_data?: any;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        setProfile(null);
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    try {
      supabase.auth
        .getSession()
        .then(({ data: { session } }) => {
          clearTimeout(timeout);
          setUser(session?.user ?? null);
          if (session?.user) fetchProfile(session.user.id);
          else setLoading(false);
        })
        .catch((err) => {
          console.error("getSession error", err);
          setLoading(false);
        });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        clearTimeout(timeout);
        setUser(session?.user ?? null);
        if (session?.user) fetchProfile(session.user.id);
        else {
          setProfile(null);
          setLoading(false);
        }
      });

      return () => {
        clearTimeout(timeout);
        subscription.unsubscribe();
      };
    } catch (err) {
      console.error("Critical useAuth error", err);
      setLoading(false);
      return () => clearTimeout(timeout);
    }
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
  }

  return { user, profile, loading, signOut };
}
