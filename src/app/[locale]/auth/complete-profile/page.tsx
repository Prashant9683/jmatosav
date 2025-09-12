"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CompleteProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "en";

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/${locale}/login`);
      return;
    }

    if (user) {
      // Pre-fill email from auth user
      setEmail(user.email || "");

      // Check if profile already exists and pre-fill
      const checkExistingProfile = async () => {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", user.id)
          .single();

        if (profile) {
          setFullName(profile.full_name || "");
          setEmail(profile.email || user.email || "");
        }
      };

      checkExistingProfile();
    }
  }, [user, authLoading, router, locale]);

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!user) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    if (!fullName.trim()) {
      setError("Full name is required");
      setLoading(false);
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    try {
      // Create or update profile
      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          full_name: fullName.trim(),
          email: email.trim(),
          role: "user", // Default role
        },
        {
          onConflict: "id",
        }
      );

      if (profileError) {
        setError(profileError.message);
      } else {
        // Profile completed successfully
        router.push(`/${locale}/dashboard`);
      }
    } catch {
      setError("An unexpected error occurred while saving your profile");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border border-neutral-200 bg-white shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
            <svg
              className="h-6 w-6 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <CardTitle className="font-heading text-2xl font-bold text-neutral-900">
            Complete Your Profile
          </CardTitle>
          <CardDescription className="font-sans text-neutral-600">
            Please provide your details to finish setting up your account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="rounded-lg bg-error-50 border border-error-200 p-3 text-sm text-error-700">
              {error}
            </div>
          )}

          <form onSubmit={handleCompleteProfile} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="fullName"
                className="font-sans text-sm font-medium text-neutral-700"
              >
                Full Name *
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={loading}
                className="h-10 border-neutral-200 bg-white font-sans text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="font-sans text-sm font-medium text-neutral-700"
              >
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="h-10 border-neutral-200 bg-white font-sans text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div className="bg-info-50 border border-info-200 rounded-lg p-3">
              <p className="font-sans text-sm text-info-700">
                <strong>Welcome to Jalore Mahotsav!</strong> After completing
                your profile, you'll be able to register for events and
                participate in our cultural festival.
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading || !fullName.trim() || !email.trim()}
              className="w-full bg-primary-500 text-white hover:bg-primary-600 font-sans font-medium"
            >
              {loading ? "Saving Profile..." : "Complete Profile"}
            </Button>
          </form>

          <div className="text-center">
            <p className="font-sans text-xs text-neutral-500">
              By completing your profile, you agree to our terms of service and
              privacy policy.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
