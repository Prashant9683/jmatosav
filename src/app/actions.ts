"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase-server";

export async function submitVolunteerApplication(formData: FormData) {
  try {
    const schema = z.object({
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

    const validated = schema.safeParse({
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phoneNumber: formData.get("phoneNumber"),
      reason: formData.get("reason"),
    });

    if (!validated.success) {
      return { success: false, message: validated.error.issues[0].message };
    }

    let supabase;
    try {
      supabase = await createClient();
    } catch (error) {
      console.error("Failed to create Supabase client:", error);
      return {
        success: false,
        message:
          "Server configuration error. Please contact the administrator.",
      };
    }

    const { error } = await supabase.from("volunteers").insert({
      full_name: validated.data.fullName,
      email: validated.data.email,
      phone_number: validated.data.phoneNumber,
      reason_for_volunteering: validated.data.reason,
      status: "pending",
    });

    if (error) {
      console.error("Error submitting volunteer application:", error);
      return {
        success: false,
        message: "Could not submit application. Please try again.",
      };
    }

    revalidatePath("/admin/volunteers"); // Refresh the admin page data
    return {
      success: true,
      message: "Thank you! Your application has been submitted successfully.",
    };
  } catch (error) {
    console.error("Unexpected error in submitVolunteerApplication:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
