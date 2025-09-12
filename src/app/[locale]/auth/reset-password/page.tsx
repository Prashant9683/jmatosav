"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
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
import Link from "next/link";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const params = useParams();
  const locale = (params.locale as string) || "en";

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/${locale}/auth/update-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md border border-neutral-200 bg-white shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success-100">
              <svg
                className="h-6 w-6 text-success-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <CardTitle className="font-heading text-2xl font-bold text-neutral-900">
              Check Your Email
            </CardTitle>
            <CardDescription className="font-sans text-neutral-600">
              We've sent a password reset link to {email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-sans text-sm text-neutral-600 text-center">
              Click the link in your email to reset your password. If you don't
              see it, check your spam folder.
            </p>
            <Link href={`/${locale}/login`}>
              <Button variant="outline" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border border-neutral-200 bg-white shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="font-heading text-2xl font-bold text-neutral-900">
            Reset Password
          </CardTitle>
          <CardDescription className="font-sans text-neutral-600">
            Enter your email address and we'll send you a link to reset your
            password
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="rounded-lg bg-error-50 border border-error-200 p-3 text-sm text-error-700">
              {error}
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="font-sans text-sm font-medium text-neutral-700"
              >
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="h-10 border-neutral-200 bg-white font-sans text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-primary-500 text-white hover:bg-primary-600 font-sans font-medium"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          <div className="text-center">
            <p className="font-sans text-sm text-neutral-600">
              Remember your password?{" "}
              <Link
                href={`/${locale}/login`}
                className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
