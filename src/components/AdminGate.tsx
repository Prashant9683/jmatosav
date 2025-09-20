// src/components/AdminGate.tsx - NEW FILE
"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { Skeleton } from "@/components/ui/skeleton";

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
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-blue-900/70 font-medium">
            Verifying admin access...
          </p>
          <div className="space-y-2 max-w-md">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile || profile.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}
