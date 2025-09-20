"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { useCurrentLocale } from "../../i18n/client";

export default function HeaderActions() {
  const router = useRouter();
  const { session, loading } = useAuth();
  const locale = useCurrentLocale();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  if (loading) {
    return <div className="text-sm text-gray-600">Loading...</div>;
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href={`/${locale}/dashboard`}
          className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          Dashboard
        </Link>
        <Link
          href={`/${locale}/profile`}
          className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          Profile
        </Link>
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="sm"
          className="text-sm font-medium text-black hover:text-gray-600"
        >
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Button asChild variant="default" size="sm">
      <Link href={`/${locale}/login`} className="text-sm font-medium">
        Login
      </Link>
    </Button>
  );
}
