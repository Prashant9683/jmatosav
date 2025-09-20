import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { z } from "zod";

const profileUpdateSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters long."),
});

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the current user's session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the submitted data from the request body
    const body = await request.json();

    // Validate the incoming data using Zod
    const validated = profileUpdateSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { success: false, message: validated.error.issues[0].message },
        { status: 400 }
      );
    }

    // Update the full_name column in the user's corresponding row in the profiles table
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ full_name: validated.data.fullName })
      .eq("id", user.id);

    if (updateError) {
      console.error("Database error:", updateError);
      return NextResponse.json(
        {
          success: false,
          message: "Could not update profile. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully!",
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
