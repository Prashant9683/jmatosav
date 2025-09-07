// src/components/AdminGate.tsx - NEW FILE
"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading authentication...
      </div>
    );
  }

  if (!profile || profile.role !== "admin") {
    router.replace("/"); // Redirect to homepage if not an admin
    return null; // Render nothing while redirecting
  }

  return <>{children}</>;
}
