"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";

export default function Home() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Cross-Platform Calendar Task Manager
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Plan your tasks across all your devices.
        </p>
      </div>

      {!loading && (
        <div className="flex gap-4">
          {user ? (
            <Link href="/dashboard">
              <Button size="lg">Go to Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg">Get started</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </main>
  );
}
