import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { z } from "zod";
import type { Database } from "@/types/supabase";

const revokeRegistrationSchema = z.object({
  registrationId: z
    .number()
    .int()
    .positive("Registration ID must be a positive integer"),
});

export async function DELETE(request: NextRequest) {
  try {
    // Get the authorization header
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Authorization header required." },
        { status: 401 }
      );
    }

    const token = authorization.replace("Bearer ", "");

    // Create Supabase client with the Bearer token
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return [];
          },
          setAll() {},
        },
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    // Get the current user's session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    console.log("Auth check in revoke route:", { user: user?.id, authError });

    if (authError || !user) {
      console.log("Authentication failed:", authError);
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the registration ID from the request body
    const body = await request.json();

    // Validate the incoming data using Zod
    const validated = revokeRegistrationSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { success: false, message: validated.error.issues[0].message },
        { status: 400 }
      );
    }

    const { registrationId } = validated.data;

    // First, verify that the registration exists and belongs to the current user
    const { data: registration, error: fetchError } = await supabase
      .from("registrations")
      .select("id, user_id, event_id, events(event_date, start_time)")
      .eq("id", registrationId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !registration) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Registration not found or you don't have permission to cancel it.",
        },
        { status: 404 }
      );
    }

    // Check if the event has already passed (optional business logic)
    const event = registration.events;
    if (event && event.event_date) {
      const eventDate = new Date(event.event_date);
      const now = new Date();

      // If the event date is in the past, don't allow cancellation
      if (eventDate < now) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Cannot cancel registration for events that have already occurred.",
          },
          { status: 400 }
        );
      }
    }

    // Delete the registration
    const { error: deleteError } = await supabase
      .from("registrations")
      .delete()
      .eq("id", registrationId)
      .eq("user_id", user.id); // Double-check user ownership

    if (deleteError) {
      console.error("Database error:", deleteError);
      return NextResponse.json(
        {
          success: false,
          message: "Could not cancel registration. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Registration cancelled successfully!",
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}
