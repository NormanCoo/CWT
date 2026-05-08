"use client";

import { useEffect } from "react";
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading, reset } = useAuthStore();

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      if (session?.user) {
        setUser(toAuthUser(session.user));
      } else {
        reset();
      }
    }).catch(() => {
      if (!cancelled) reset();
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(toAuthUser(session.user));
      } else {
        reset();
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [setUser, setLoading, reset]);

  return <>{children}</>;
}
