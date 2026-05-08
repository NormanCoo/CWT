"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";

export default function Home() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center text-center max-w-md mx-auto gap-6">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
          <CalendarDays className="h-8 w-8 text-primary" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            CP-CTM
          </h1>
          <p className="text-lg text-muted-foreground">
            Plan your tasks across all your devices.
          </p>
        </div>

        {!loading && (
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-2">
            {user ? (
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full">
                    Sign in
                  </Button>
                </Link>
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full">
                    Get started
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
