// src/app/actions.ts - Server Actions for admin operations
"use server";

import { createClient } from "@/lib/supabase-server";

export async function checkInTicket(
  registrationId: string,
  adminUserId: string
) {
  try {
    const supabase = await createClient();

    // Security: check if the current user is an admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", adminUserId)
      .single();

    if (profileError || !profile) {
      return { success: false, message: "User not found." };
    }

    if (profile.role !== "admin") {
      return { success: false, message: "Unauthorized." };
    }

    // Validate the QR payload is a numeric registration ID
    const regId = Number.parseInt(registrationId, 10);
    if (Number.isNaN(regId)) {
      return { success: false, message: "Invalid QR code." };
    }

    // Find the registration with proper joins
    const { data: registration, error: regError } = await supabase
      .from("registrations")
      .select(
        `
        id, 
        checked_in_at, 
        profiles!inner(full_name), 
        events!inner(title_en)
      `
      )
      .eq("id", regId)
      .single();

    if (regError || !registration) {
      return { success: false, message: "Ticket Not Found." };
    }

    if (registration.checked_in_at) {
      return {
        success: false,
        message: `Already Checked In at ${new Date(
          registration.checked_in_at
        ).toLocaleTimeString()}`,
        participant: {
          profiles: registration.profiles,
          events: registration.events,
        },
      };
    }

    // Update the registration to mark as checked in
    const { error: updateError } = await supabase
      .from("registrations")
      .update({ checked_in_at: new Date().toISOString() })
      .eq("id", registration.id);

    if (updateError) {
      console.error("Update error:", updateError);
      return { success: false, message: "Database error. Could not check in." };
    }

    return {
      success: true,
      message: "Check-in Successful!",
      participant: {
        profiles: registration.profiles,
        events: registration.events,
      },
    };
  } catch (error) {
    console.error("Server action error:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}
