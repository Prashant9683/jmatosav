import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { registrationId, adminUserId } = body;

    const supabase = await createClient();

    // Security: check if the current user is an admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", adminUserId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ success: false, message: "User not found." });
    }

    if (profile.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized." });
    }

    // Validate the QR payload is a numeric registration ID
    const regId = Number.parseInt(registrationId, 10);
    if (Number.isNaN(regId)) {
      return NextResponse.json({ success: false, message: "Invalid QR code." });
    }

    // Find the registration with explicit joins
    console.log("Looking for registration ID:", regId);
    const { data: registration, error: regError } = await supabase
      .from("registrations")
      .select(
        `
        id, 
        checked_in_at,
        user_id,
        event_id
      `
      )
      .eq("id", regId)
      .single();

    console.log("Registration query result:", { registration, regError });

    if (regError || !registration) {
      console.log("Registration not found or error:", regError);
      return NextResponse.json({
        success: false,
        message: "Ticket Not Found.",
      });
    }

    // Get profile and event data separately
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", registration.user_id)
      .single();

    const { data: eventData } = await supabase
      .from("events")
      .select("title_en")
      .eq("id", registration.event_id)
      .single();

    console.log("Profile and event data:", { userProfile, eventData });

    if (registration.checked_in_at) {
      return NextResponse.json({
        success: false,
        message: `Already Checked In at ${new Date(
          registration.checked_in_at
        ).toLocaleTimeString()}`,
        participant: {
          profiles: userProfile,
          events: eventData,
        },
      });
    }

    // Update the registration to mark as checked in
    const { error: updateError } = await supabase
      .from("registrations")
      .update({ checked_in_at: new Date().toISOString() })
      .eq("id", registration.id);

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json({
        success: false,
        message: "Database error. Could not check in.",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Check-in Successful!",
      participant: {
        profiles: userProfile,
        events: eventData,
      },
    });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
