"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "en";

  useEffect(() => {
    // Check if user has a valid session (from reset link)
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push(`/${locale}/login`);
      } else {
        setSession(session);
      }
    };

    checkSession();
  }, [router, locale]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push(`/${locale}/dashboard`);
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border border-neutral-200 bg-white shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="font-heading text-2xl font-bold text-neutral-900">
            Update Password
          </CardTitle>
          <CardDescription className="font-sans text-neutral-600">
            Enter your new password below
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="rounded-lg bg-error-50 border border-error-200 p-3 text-sm text-error-700">
              {error}
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="font-sans text-sm font-medium text-neutral-700"
              >
                New Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="h-10 border-neutral-200 bg-white font-sans text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="font-sans text-sm font-medium text-neutral-700"
              >
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                className="h-10 border-neutral-200 bg-white font-sans text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !password || !confirmPassword}
              className="w-full bg-primary-500 text-white hover:bg-primary-600 font-sans font-medium"
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
