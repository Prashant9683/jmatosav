"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase-client";

export default function AuthCallbackPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "en";

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth callback error:", error);
          setError(error.message);
          return;
        }

        if (data.session?.user) {
          // Check if user has a profile
          const { data: profile } = await supabase
            .from("profiles")
            .select("id, full_name, email")
            .eq("id", data.session.user.id)
            .single();

          if (!profile) {
            // New user, redirect to profile completion
            router.push(`/${locale}/auth/complete-profile`);
          } else if (!profile.full_name || !profile.email) {
            // Profile exists but incomplete, redirect to complete it
            router.push(`/${locale}/auth/complete-profile`);
          } else {
            // Profile complete, redirect to dashboard
            router.push(`/${locale}/dashboard`);
          }
        } else {
          // No session, something went wrong
          setError("Authentication failed. Please try again.");
        }
      } catch (err) {
        console.error("Callback error:", err);
        setError("An unexpected error occurred during authentication.");
      }
    };

    // Add a small delay to ensure the URL fragment is processed
    const timeoutId = setTimeout(handleAuthCallback, 1000);

    return () => clearTimeout(timeoutId);
  }, [router, locale]);

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white border border-red-500 rounded-lg p-6 shadow-lg">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-black mb-2">
              Authentication Error
            </h2>
            <p className="text-blue-900/70 mb-4">{error}</p>
            <button
              onClick={() => router.push(`/${locale}/login`)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all duration-200"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
        <p className="text-lg text-blue-900/70">Completing authentication...</p>
      </div>
    </div>
  );
}
