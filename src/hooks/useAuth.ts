"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/useAuthStore";
import type { AuthUser } from "@/types";

function toAuthUser(u: {
  id: string;
  email?: string | null;
  user_metadata?: { full_name?: string; avatar_url?: string };
}): AuthUser {
  return {
    id: u.id,
    email: u.email ?? "",
    full_name: u.user_metadata?.full_name ?? null,
    avatar_url: u.user_metadata?.avatar_url ?? null,
  };
}

export function useAuth() {
  const { user, loading, setUser, setLoading, reset } = useAuthStore();
  const router = useRouter();
  const supabase = createClient();

  const getSession = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
      setUser(toAuthUser(data.session.user));
    } else {
      reset();
    }
    setLoading(false);
    return data.session;
  }, [supabase, setUser, setLoading, reset]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (data.session?.user) setUser(toAuthUser(data.session.user));
      return { data, error };
    },
    [supabase, setUser],
  );

  const signUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (data.session?.user) setUser(toAuthUser(data.session.user));
      return { data, error };
    },
    [supabase, setUser],
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    reset();
    router.push("/login");
  }, [supabase, reset, router]);

  const resetPassword = useCallback(
    async (email: string) => {
      return supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });
    },
    [supabase],
  );

  return {
    user,
    loading,
    getSession,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
}
