// src/components/AdminGate.tsx - NEW FILE
"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const params = useParams<{ locale?: string }>();

  useEffect(() => {
    if (!loading && (!profile || profile.role !== "admin")) {
      const locale = params?.locale || "en";
      router.replace(`/${locale}`);
    }
  }, [loading, profile, router, params?.locale]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading authentication...
      </div>
    );
  }

  if (!profile || profile.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}
