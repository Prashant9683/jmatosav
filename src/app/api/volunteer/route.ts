import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { z } from "zod";

const volunteerSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters long."),
  email: z.string().email("Invalid email address."),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits.")
    .refine(
      (val) => /^[6-9]\d{9}$/.test(val),
      "Phone number must start with 6, 7, 8, or 9."
    ),
  reason: z.string().min(10, "Reason must be at least 10 characters long."),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request data
    const validated = volunteerSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { success: false, message: validated.error.issues[0].message },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase.from("volunteers").insert({
      full_name: validated.data.fullName,
      email: validated.data.email,
      phone_number: validated.data.phoneNumber,
      reason_for_volunteering: validated.data.reason,
      status: "pending",
    });

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Could not submit application. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! Your application has been submitted successfully.",
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
