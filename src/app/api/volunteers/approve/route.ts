import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: NextRequest) {
  try {
    const { volunteerId } = await request.json();

    if (!volunteerId || typeof volunteerId !== "number") {
      return NextResponse.json(
        { success: false, message: "Invalid volunteer ID" },
        { status: 400 }
      );
    }

    // Get the authorization header
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Authorization header required." },
        { status: 401 }
      );
    }

    const token = authorization.replace("Bearer ", "");

    const supabase = createServerClient(
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

    // Check if user is admin
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    console.log("User authentication check:", { user: user?.id, userError });

    if (!user) {
      console.log("No user found in session");
      return NextResponse.json(
        { success: false, message: "Authentication required." },
        { status: 401 }
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    console.log("Profile check:", { profile, profileError });

    if (!profile || profile.role !== "admin") {
      console.log("User is not admin:", { profile: profile?.role });
      return NextResponse.json(
        { success: false, message: "Admin access required." },
        { status: 403 }
      );
    }

    // Update volunteer status to approved
    const { error } = await supabase
      .from("volunteers")
      .update({ status: "approved" })
      .eq("id", volunteerId);

    if (error) {
      console.error("Error approving volunteer:", error);
      return NextResponse.json(
        { success: false, message: "Failed to approve volunteer." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Volunteer approved successfully.",
    });
  } catch (error) {
    console.error("Unexpected error in approve volunteer:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
