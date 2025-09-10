"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import { useAuth } from "@/components/AuthProvider";

export default function HeaderActions() {
  const router = useRouter();
  const { session, loading } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  if (loading) {
    return <div className="text-sm">Loading...</div>;
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="text-sm font-medium hover:underline">
          Dashboard
        </Link>
        <button
          onClick={handleLogout}
          className="text-sm font-medium hover:underline"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <Link href="/login" className="text-sm font-medium hover:underline">
      Login
    </Link>
  );
}
