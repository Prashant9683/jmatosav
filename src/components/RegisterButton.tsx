"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import { useUser } from "@/components/AuthProvider";

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

  const handleRegister = async () => {
    if (!user) {
      // If user is not logged in, redirect to login page
      router.push("/login");
      return;
    }

    setIsLoading(true);
    const { error } = await supabase
      .from("registrations")
      .insert({ event_id: eventId, user_id: user.id });

    if (error) {
      // This could happen if they are already registered (due to the UNIQUE constraint)
      console.error("Error registering:", error);
      alert("Could not register for the event. You may already be registered.");
    } else {
      setIsRegistered(true);
    }
    setIsLoading(false);
  };

  if (!user) {
    return (
      <button
        onClick={handleRegister}
        className="mt-8 w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
      >
        Login to Register
      </button>
    );
  }

  if (isRegistered) {
    return (
      <button
        disabled
        className="mt-8 w-full bg-green-700 text-white font-bold py-3 px-4 rounded-lg cursor-not-allowed"
      >
        ✅ Registered
      </button>
    );
  }

  return (
    <button
      onClick={handleRegister}
      disabled={isLoading}
      className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-blue-900"
    >
      {isLoading ? "Registering..." : "Register for this Event"}
    </button>
  );
}
