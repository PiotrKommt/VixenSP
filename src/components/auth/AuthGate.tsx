"use client";

import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { AuthScreen } from "@/components/auth/AuthScreen";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();

  if (status === "loading") {
    return (
      <div className="grid min-h-screen place-items-center bg-ink-950">
        <Loader2 className="h-6 w-6 animate-spin text-brand-400" />
      </div>
    );
  }

  if (status !== "authenticated") {
    return <AuthScreen />;
  }

  return <>{children}</>;
}
