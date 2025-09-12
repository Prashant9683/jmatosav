"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase-client";

export default function AuthCallbackPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
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
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white border border-error-200 rounded-lg p-6 shadow-lg">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error-100">
              <svg
                className="h-6 w-6 text-error-600"
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
            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-2">
              Authentication Error
            </h2>
            <p className="font-sans text-neutral-600 mb-4">{error}</p>
            <button
              onClick={() => router.push(`/${locale}/login`)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-500 mx-auto mb-4"></div>
        <p className="font-sans text-lg text-neutral-600">
          Completing authentication...
        </p>
      </div>
    </div>
  );
}
