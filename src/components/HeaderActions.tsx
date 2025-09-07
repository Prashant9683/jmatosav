"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import type { Session } from "@supabase/supabase-js";

export default function HeaderActions({
  session,
}: {
  session: Session | null;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

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
