"use client";

import type React from "react";
import { useState } from "react";
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
import Link from "next/link";

interface AuthFormProps {
  mode?: "signin" | "signup";
}

export function AuthForm({ mode = "signin" }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "en";

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push(`/${locale}/dashboard`);
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/${locale}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess("Check your email for the confirmation link!");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/${locale}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const isSignUp = mode === "signup";

  return (
    <Card className="w-full max-w-md border border-black/10 bg-white shadow-xl">
      <CardHeader className="space-y-3 text-center pb-6">
        <CardTitle className="text-3xl font-bold text-black">
          {isSignUp ? "Join Jalore Mahotsav" : "Welcome Back"}
        </CardTitle>
        <CardDescription className="text-base text-blue-900/70">
          {isSignUp
            ? "Create your account to discover amazing cultural events"
            : "Sign in to your account to continue"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 px-6 pb-6">
        {error && (
          <div className="rounded-lg bg-white border border-red-500 p-4 text-sm font-medium text-red-900">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg bg-white border border-green-500 p-4 text-sm font-medium text-green-900">
            {success}
          </div>
        )}

        <form
          onSubmit={isSignUp ? handleSignUp : handleSignIn}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-black">
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
              className="h-12 border-black/20 bg-white text-black placeholder:text-blue-900/50 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-semibold text-black"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={
                isSignUp
                  ? "Create a password (min. 6 characters)"
                  : "Enter your password"
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="h-12 border-black/20 bg-white text-black placeholder:text-blue-900/50 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 transition-all"
            />
          </div>

          {isSignUp && (
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-semibold text-black"
              >
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                className="h-12 border-black/20 bg-white text-black placeholder:text-blue-900/50 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 transition-all"
              />
            </div>
          )}

          {!isSignUp && (
            <div className="flex justify-end">
              <Link
                href={`/${locale}/auth/reset-password`}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700 font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {loading
              ? isSignUp
                ? "Creating account..."
                : "Signing in..."
              : isSignUp
              ? "Create Account"
              : "Sign In"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-black/20" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 font-medium text-blue-900/70">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full h-12 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700 font-semibold text-base transition-all duration-200"
        >
          <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button>

        <div className="text-center">
          <p className="text-sm text-blue-900/70">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <Link
              href={`/${locale}/${isSignUp ? "login" : "signup"}`}
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
