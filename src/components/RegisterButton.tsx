"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import { useUser } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

interface RegisterButtonProps {
  eventId: number;
  isInitiallyRegistered: boolean;
}

export default function RegisterButton({
  eventId,
  isInitiallyRegistered,
}: RegisterButtonProps) {
  const user = useUser();
  const router = useRouter();
  const [isRegistered, setIsRegistered] = useState(isInitiallyRegistered);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!user) {
      // If user is not logged in, redirect to login page
      router.push("/login");
      return;
    }

    setIsLoading(true);
    setError(null);

    const { error: registrationError } = await supabase
      .from("registrations")
      .insert({ event_id: eventId, user_id: user.id });

    if (registrationError) {
      // This could happen if they are already registered (due to the UNIQUE constraint)
      console.error("Error registering:", registrationError);
      setError(
        "Could not register for the event. You may already be registered."
      );
    } else {
      setIsRegistered(true);
    }
    setIsLoading(false);
  };

  if (!user) {
    return (
      <div className="mt-8 space-y-4">
        <Button
          onClick={handleRegister}
          variant="outline"
          className="w-full h-12 text-base font-semibold border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          Login to Register
        </Button>
      </div>
    );
  }

  if (isRegistered) {
    return (
      <div className="mt-8 space-y-4">
        <Button
          disabled
          className="w-full h-12 text-base font-semibold bg-green-500 text-white cursor-not-allowed opacity-100"
        >
          ✅ Registered
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      {error && <Alert variant="error">{error}</Alert>}
      <Button
        onClick={handleRegister}
        disabled={isLoading}
        className="w-full h-12 text-base font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isLoading ? "Registering..." : "Register for this Event"}
      </Button>
    </div>
  );
}
