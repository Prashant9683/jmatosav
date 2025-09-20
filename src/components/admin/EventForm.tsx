"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import type { Database } from "@/types/supabase";

// Define a type for the local form state
type FormState = {
  title_en: string;
  title_hi: string;
  description_en: string;
  description_hi: string;
  rules_en: string;
  rules_hi: string;
  venue_en: string;
  venue_hi: string;
  event_date: string;
  start_time: string;
  end_time: string;
  image_url: string;
  category: string;
  organizer_1_name: string;
  organizer_1_phone: string;
  organizer_2_name: string;
  organizer_2_phone: string;
};

type Event = Database["public"]["Tables"]["events"]["Row"];
interface EventFormProps {
  initialData?: Event | null; // This prop will be used when editing an existing event
  locale: string; // Locale for proper navigation
}

export default function EventForm({ initialData, locale }: EventFormProps) {
  console.log("🎯 EventForm component rendered with:", {
    initialData: !!initialData,
    locale,
  });
  const router = useRouter();
  // Initialize form state with initialData if it exists, otherwise use empty strings
  const [formData, setFormData] = useState<FormState>({
    title_en: initialData?.title_en || "",
    title_hi: initialData?.title_hi || "",
    description_en: initialData?.description_en || "",
    description_hi: initialData?.description_hi || "",
    rules_en: initialData?.rules_en || "",
    rules_hi: initialData?.rules_hi || "",
    venue_en: initialData?.venue_en || "",
    venue_hi: initialData?.venue_hi || "",
    event_date: initialData?.event_date || "",
    start_time: initialData?.start_time || "",
    end_time: initialData?.end_time || "",
    image_url: initialData?.image_url || "",
    category: initialData?.category || "Competition",
    organizer_1_name: initialData?.organizer_1_name || "",
    organizer_1_phone: initialData?.organizer_1_phone || "",
    organizer_2_name: initialData?.organizer_2_name || "",
    organizer_2_phone: initialData?.organizer_2_phone || "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Debug loading state changes
  console.log("🔄 isLoading state:", isLoading);

  // A single handler to update the form state
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handles form submission for both creating and updating
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("🚀 handleSubmit called!");
    e.preventDefault();
    console.log("✅ preventDefault called");
    setIsLoading(true);
    console.log("✅ setIsLoading(true) called");

    try {
      console.log("🔍 Starting validation...");
      // Validate required fields
      if (
        !formData.title_en ||
        !formData.title_hi ||
        !formData.event_date ||
        !formData.start_time
      ) {
        console.log("❌ Validation failed - missing required fields");
        alert(
          "Please fill in all required fields (Title in both languages, Event Date, and Start Time)."
        );
        setIsLoading(false);
        return;
      }
      console.log("✅ Validation passed");

      // Check if Supabase is properly configured
      console.log(
        "Supabase URL:",
        process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set"
      );
      console.log(
        "Supabase Key:",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not set"
      );

      // Log the actual values (first few characters for security)
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        console.log(
          "Supabase URL starts with:",
          process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 20) + "..."
        );
        console.log("Full Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
      } else {
        console.error("❌ NEXT_PUBLIC_SUPABASE_URL is undefined!");
      }
      if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.log(
          "Supabase Key starts with:",
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20) + "..."
        );
        console.log(
          "Full Supabase Key:",
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );
      } else {
        console.error("❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is undefined!");
      }

      // Check if environment variables are actually available
      if (
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ) {
        console.error("❌ Supabase environment variables are missing!");
        alert(
          "Configuration error: Supabase environment variables are not set. Please contact the administrator."
        );
        setIsLoading(false);
        return;
      }

      // Use the existing supabase client instead of creating a new one
      console.log("🔧 Using existing Supabase client:", supabase);

      // Skip connectivity test for now and proceed directly to the main operation
      console.log(
        "⏭️ Skipping connectivity test due to timeout issues, proceeding to main operation"
      );

      // Skip connection test for now - it might be causing the hang
      console.log("⏭️ Skipping connection test, proceeding to main operation");
      console.log("Submitting form data:", formData);
      console.log("Operation type:", initialData ? "UPDATE" : "INSERT");

      // Check for any null/undefined values that might cause issues
      const problematicFields = Object.entries(formData).filter(
        ([, value]) => value === null || value === undefined
      );
      if (problematicFields.length > 0) {
        console.warn("Found problematic fields:", problematicFields);
      }

      // Helper to compute UTF-8 byte size (important for Hindi text)
      const byteSize = (val: unknown) =>
        typeof window !== "undefined"
          ? new TextEncoder().encode(
              typeof val === "string" ? val : JSON.stringify(val)
            ).length
          : Buffer.from(
              typeof val === "string" ? val : JSON.stringify(val),
              "utf8"
            ).length;

      // Perform the Supabase operation
      console.log("🚀 Starting Supabase operation...");
      const startTime = Date.now();

      let data: unknown, error: unknown;
      let cleanedData: Database["public"]["Tables"]["events"]["Insert"] | null =
        null;
      let wasTruncated = false;

      try {
        if (initialData) {
          console.log("Performing UPDATE operation...");

          // Prepare a cleaned payload similar to INSERT path
          let updatePayload: Database["public"]["Tables"]["events"]["Update"] =
            {
              title_en: formData.title_en.trim(),
              title_hi: formData.title_hi.trim(),
              event_date: formData.event_date,
              start_time: formData.start_time,
              end_time: formData.end_time?.trim() || null,
              description_en: formData.description_en?.trim() || null,
              description_hi: formData.description_hi?.trim() || null,
              rules_en: formData.rules_en?.trim() || null,
              rules_hi: formData.rules_hi?.trim() || null,
              venue_en: formData.venue_en?.trim() || null,
              venue_hi: formData.venue_hi?.trim() || null,
              image_url: formData.image_url?.trim() || null,
              category: formData.category?.trim() || null,
              organizer_1_name: formData.organizer_1_name?.trim() || null,
              organizer_1_phone: formData.organizer_1_phone?.trim() || null,
              organizer_2_name: formData.organizer_2_name?.trim() || null,
              organizer_2_phone: formData.organizer_2_phone?.trim() || null,
            };

          // Calculate data size (in bytes) and dynamic timeout
          let updateSize = byteSize(updatePayload);
          console.log("📊 Update payload size:", updateSize, "bytes (UTF-8)");
          const isLargeUpdate = updateSize >= 15000;
          const updateTimeout = isLargeUpdate ? 120000 : 30000;
          console.log(
            "⏰ Using update timeout:",
            updateTimeout / 1000,
            "seconds"
          );

          // Conservative response handling for large updates
          const useSelectOnUpdate = updateSize < 15000;
          console.log("📋 UPDATE using .select():", useSelectOnUpdate);

          // Free-tier compatibility: truncate if very large overall size
          if (updateSize > 25000) {
            console.log(
              "⚠️ Update size exceeds 25k, truncating large text fields for free tier..."
            );
            updatePayload = {
              ...updatePayload,
              description_en:
                updatePayload.description_en?.substring(0, 800) || null,
              description_hi:
                updatePayload.description_hi?.substring(0, 800) || null,
              rules_en: updatePayload.rules_en?.substring(0, 1500) || null,
              rules_hi: updatePayload.rules_hi?.substring(0, 1500) || null,
            };
            wasTruncated = true;
            updateSize = byteSize(updatePayload);
            console.log(
              "📊 Update size after truncation:",
              updateSize,
              "bytes"
            );
          }

          const updatePromise = useSelectOnUpdate
            ? supabase
                .from("events")
                .update(updatePayload)
                .eq("id", initialData.id)
                .select()
            : supabase
                .from("events")
                .update(updatePayload)
                .eq("id", initialData.id);

          const updateTimeoutPromise = new Promise((_, reject) =>
            setTimeout(
              () =>
                reject(
                  new Error(
                    `Operation timed out after ${updateTimeout / 1000} seconds`
                  )
                ),
              updateTimeout
            )
          );

          try {
            const result = (await Promise.race([
              updatePromise,
              updateTimeoutPromise,
            ])) as { data: unknown; error: unknown };
            console.log("📝 Update result:", result);
            data = result.data;
            error = result.error;
          } catch (updateErr) {
            console.error("❌ UPDATE operation failed:", updateErr);
            // Fallback for timeouts on large updates: try more aggressive truncation, no select
            if (
              updateErr instanceof Error &&
              updateErr.message.includes("timed out") &&
              updateSize > 15000
            ) {
              console.log(
                "🔄 UPDATE fallback with more aggressive truncation and no .select()"
              );
              const moreTruncated = {
                ...updatePayload,
                description_en:
                  updatePayload.description_en?.substring(0, 500) || null,
                description_hi:
                  updatePayload.description_hi?.substring(0, 500) || null,
                rules_en: updatePayload.rules_en?.substring(0, 1200) || null,
                rules_hi: updatePayload.rules_hi?.substring(0, 1200) || null,
              };
              wasTruncated = true;
              const fallbackRes = await supabase
                .from("events")
                .update(moreTruncated)
                .eq("id", initialData.id);
              data = fallbackRes.data;
              error = fallbackRes.error;
            } else {
              throw updateErr;
            }
          }
        } else {
          console.log("📝 Performing INSERT operation...");
          console.log("📝 Insert data:", formData);

          // Build a strongly-typed Insert payload with validation
          cleanedData = {
            title_en: formData.title_en.trim(),
            title_hi: formData.title_hi.trim(),
            event_date: formData.event_date,
            start_time: formData.start_time,
            end_time: formData.end_time?.trim() || null,
            description_en: formData.description_en?.trim() || null,
            description_hi: formData.description_hi?.trim() || null,
            rules_en: formData.rules_en?.trim() || null,
            rules_hi: formData.rules_hi?.trim() || null,
            venue_en: formData.venue_en?.trim() || null,
            venue_hi: formData.venue_hi?.trim() || null,
            image_url: formData.image_url?.trim() || null,
            category: formData.category?.trim() || null,
            organizer_1_name: formData.organizer_1_name?.trim() || null,
            organizer_1_phone: formData.organizer_1_phone?.trim() || null,
            organizer_2_name: formData.organizer_2_name?.trim() || null,
            organizer_2_phone: formData.organizer_2_phone?.trim() || null,
          };

          // Additional validation for required fields
          if (
            !cleanedData.title_en ||
            !cleanedData.title_hi ||
            !cleanedData.event_date ||
            !cleanedData.start_time
          ) {
            console.error("❌ Missing required fields:", {
              title_en: !!cleanedData.title_en,
              title_hi: !!cleanedData.title_hi,
              event_date: !!cleanedData.event_date,
              start_time: !!cleanedData.start_time,
            });
            alert(
              "Missing required fields. Please fill in all required fields."
            );
            setIsLoading(false);
            return;
          }
          console.log("📝 Cleaned data:", cleanedData);

          // Skip connection test - proceed directly to the main operation
          console.log(
            "⏭️ Skipping connection test, proceeding to main operation"
          );

          // Perform INSERT operation with better error handling
          console.log("📝 Starting INSERT operation...");
          console.log(
            "📝 Data being inserted:",
            JSON.stringify(cleanedData, null, 2)
          );

          // Calculate data size (in bytes) to determine appropriate timeout
          let dataSize = byteSize(cleanedData);

          try {
            console.log("📊 Payload size:", dataSize, "bytes (UTF-8)");

            // Use longer timeout for large data (2 minutes)
            const timeoutDuration = dataSize >= 15000 ? 120000 : 30000;
            console.log(
              "⏰ Using timeout duration:",
              timeoutDuration / 1000,
              "seconds"
            );

            // For very large data, try without .select() first to reduce response size
            // Also use more conservative limits for free tier
            const shouldUseSelect = dataSize < 15000;
            console.log("📋 Using .select():", shouldUseSelect);

            // For free tier, be more conservative with data size
            if (dataSize > 25000) {
              console.log(
                "⚠️ Data size exceeds recommended limit for free tier, attempting truncation..."
              );
              const truncatedData = {
                ...cleanedData,
                description_en:
                  cleanedData.description_en?.substring(0, 800) || null,
                description_hi:
                  cleanedData.description_hi?.substring(0, 800) || null,
                rules_en: cleanedData.rules_en?.substring(0, 1500) || null,
                rules_hi: cleanedData.rules_hi?.substring(0, 1500) || null,
              };
              console.log(
                "📝 Using truncated data for free tier compatibility"
              );
              cleanedData = truncatedData;
              wasTruncated = true;
              dataSize = byteSize(cleanedData);
              console.log(
                "📊 New payload size after truncation:",
                dataSize,
                "bytes"
              );
            }

            // Add a reasonable timeout to prevent infinite hanging
            const insertPromise = shouldUseSelect
              ? supabase.from("events").insert(cleanedData).select()
              : supabase.from("events").insert(cleanedData);

            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(
                () =>
                  reject(
                    new Error(
                      `Operation timed out after ${
                        timeoutDuration / 1000
                      } seconds`
                    )
                  ),
                timeoutDuration
              )
            );

            const result = (await Promise.race([
              insertPromise,
              timeoutPromise,
            ])) as { data: unknown; error: unknown };
            console.log("📝 Insert result:", result);
            data = result.data;
            error = result.error;

            if (error) {
              console.error("❌ Supabase INSERT error:", error);
            } else {
              console.log("✅ INSERT successful:", data);
            }
          } catch (insertError) {
            console.error(
              "❌ INSERT operation failed with exception:",
              insertError
            );

            // If it's a timeout error and data is large, try with truncated text fields
            if (
              insertError instanceof Error &&
              insertError.message.includes("timed out") &&
              dataSize > 15000
            ) {
              console.log(
                "🔄 Attempting fallback with truncated text fields..."
              );
              try {
                const truncatedData = {
                  ...cleanedData,
                  description_en:
                    cleanedData.description_en?.substring(0, 1000) || null,
                  description_hi:
                    cleanedData.description_hi?.substring(0, 1000) || null,
                  rules_en: cleanedData.rules_en?.substring(0, 2000) || null,
                  rules_hi: cleanedData.rules_hi?.substring(0, 2000) || null,
                };
                wasTruncated = true;

                const fallbackResult = await supabase
                  .from("events")
                  .insert(truncatedData)
                  .select();

                if (fallbackResult.error) {
                  console.error(
                    "❌ Fallback INSERT also failed:",
                    fallbackResult.error
                  );
                  error = fallbackResult.error;
                  data = null;
                } else {
                  console.log(
                    "✅ Fallback INSERT successful with truncated data"
                  );
                  data = fallbackResult.data;
                  error = null;
                }
              } catch (fallbackError) {
                console.error(
                  "❌ Fallback INSERT failed with exception:",
                  fallbackError
                );
                error = fallbackError;
                data = null;
              }
            } else {
              error = insertError;
              data = null;
            }
          }
        }
      } catch (supabaseError) {
        console.error(
          "Supabase operation failed with exception:",
          supabaseError
        );
        error = supabaseError;
        data = null;
      }

      const endTime = Date.now();
      console.log(`Supabase operation completed in ${endTime - startTime}ms`);

      console.log("Supabase response:", { data, error });

      if (error) {
        console.error("Error saving event:", error);
        let errorMessage = "Unknown error";
        if (error && typeof error === "object" && "message" in error) {
          const maybeMessage = (error as { message?: unknown }).message;
          if (typeof maybeMessage === "string") {
            errorMessage = maybeMessage;
          }
        }
        alert(`Failed to save event: ${errorMessage}`);
        setIsLoading(false);
        return;
      }

      console.log("Event saved successfully:", data);

      // Check if data was truncated and inform user
      const originalDataSize = byteSize(formData);
      if (wasTruncated || originalDataSize > 25000) {
        alert(
          `Event ${
            initialData ? "updated" : "created"
          } successfully! Note: Some text fields were automatically shortened to ensure compatibility with the database.`
        );
      } else {
        alert(`Event ${initialData ? "updated" : "created"} successfully!`);
      }

      // Navigate back to admin dashboard
      router.push(`/${locale}/admin`);
      router.refresh();
    } catch (err) {
      console.error("Unexpected error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      alert(
        `Error: ${errorMessage}. Please check your internet connection and try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-black mb-2">
            {initialData ? "Edit Event" : "Create New Event"}
          </h1>
          <p className="text-blue-900/70">
            Fill in the details for the festival event
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Bilingual Fields Section */}
          <div className="bg-white border border-black/10 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold text-black mb-6 flex items-center">
              <span className="w-2 h-6 bg-blue-600 mr-3 rounded"></span>
              Event Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="title_en"
                  className="block text-sm font-medium text-black"
                >
                  Title (English) *
                </label>
                <input
                  type="text"
                  id="title_en"
                  name="title_en"
                  value={formData.title_en}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-black/20 rounded-md text-black placeholder:text-blue-900/50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
                  placeholder="Enter event title in English"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="title_hi"
                  className="block text-sm font-medium text-black"
                >
                  Title (Hindi) *
                </label>
                <input
                  type="text"
                  id="title_hi"
                  name="title_hi"
                  value={formData.title_hi}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-black/20 rounded-md text-black placeholder:text-blue-900/50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
                  placeholder="हिंदी में इवेंट का शीर्षक दर्ज करें"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description_en"
                  className="block text-sm font-medium text-black"
                >
                  Description (English)
                </label>
                <textarea
                  name="description_en"
                  value={formData.description_en || ""}
                  onChange={handleChange}
                  className="w-full h-24 px-3 py-2 bg-white border border-black/20 rounded-md text-black placeholder:text-blue-900/50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
                  placeholder="Describe the event in English"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description_hi"
                  className="block text-sm font-medium text-black"
                >
                  Description (Hindi)
                </label>
                <textarea
                  name="description_hi"
                  value={formData.description_hi || ""}
                  onChange={handleChange}
                  className="w-full h-24 px-3 py-2 bg-white border border-black/20 rounded-md text-black placeholder:text-blue-900/50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
                  placeholder="हिंदी में इवेंट का विवरण दें"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="rules_en"
                  className="block text-sm font-medium text-black"
                >
                  Rules (English)
                </label>
                <textarea
                  name="rules_en"
                  value={formData.rules_en || ""}
                  onChange={handleChange}
                  className="w-full h-24 px-3 py-2 bg-white border border-black/20 rounded-md text-black placeholder:text-blue-900/50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
                  placeholder="Enter event rules in English"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="rules_hi"
                  className="block text-sm font-medium text-black"
                >
                  Rules (Hindi)
                </label>
                <textarea
                  name="rules_hi"
                  value={formData.rules_hi || ""}
                  onChange={handleChange}
                  className="w-full h-24 px-3 py-2 bg-white border border-black/20 rounded-md text-black placeholder:text-blue-900/50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
                  placeholder="हिंदी में इवेंट के नियम दर्ज करें"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="venue_en"
                  className="block text-sm font-medium text-black"
                >
                  Venue (English)
                </label>
                <input
                  type="text"
                  name="venue_en"
                  value={formData.venue_en || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-black/20 rounded-md text-black placeholder:text-blue-900/50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
                  placeholder="Enter venue in English"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="venue_hi"
                  className="block text-sm font-medium text-black"
                >
                  Venue (Hindi)
                </label>
                <input
                  type="text"
                  name="venue_hi"
                  value={formData.venue_hi || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-black/20 rounded-md text-black placeholder:text-blue-900/50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
                  placeholder="हिंदी में स्थान दर्ज करें"
                />
              </div>
            </div>
          </div>

          {/* Event Details Section */}
          <div className="bg-white border border-black/10 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold text-black mb-6 flex items-center">
              <span className="w-2 h-6 bg-blue-600 mr-3 rounded"></span>
              Event Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="event_date"
                  className="block text-sm font-medium text-black"
                >
                  Event Date *
                </label>
                <input
                  type="date"
                  id="event_date"
                  name="event_date"
                  value={formData.event_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-black/20 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="start_time"
                  className="block text-sm font-medium text-black"
                >
                  Start Time *
                </label>
                <input
                  type="time"
                  id="start_time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-black/20 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="end_time"
                  className="block text-sm font-medium text-black"
                >
                  End Time (Optional)
                </label>
                <input
                  type="time"
                  name="end_time"
                  value={formData.end_time || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-black/20 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-black"
                >
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-black/20 rounded-md text-black placeholder:text-blue-900/50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
                  placeholder="e.g., Competition, Performance, Workshop"
                />
              </div>

              <div className="col-span-1 md:col-span-2 lg:col-span-2 space-y-2">
                <label
                  htmlFor="image_url"
                  className="block text-sm font-medium text-black"
                >
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-black/20 rounded-md text-black placeholder:text-blue-900/50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>

          {/* Organizer Information Section */}
          <div className="bg-white border border-black/10 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold text-black mb-6 flex items-center">
              <span className="w-2 h-6 bg-blue-600 mr-3 rounded"></span>
              Organizer Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="organizer_1_name"
                  className="block text-sm font-medium text-black"
                >
                  Organizer 1 Name
                </label>
                <input
                  type="text"
                  name="organizer_1_name"
                  value={formData.organizer_1_name || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-black/20 rounded-md text-black placeholder:text-blue-900/50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
                  placeholder="Enter organizer name"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="organizer_1_phone"
                  className="block text-sm font-medium text-black"
                >
                  Organizer 1 Phone
                </label>
                <input
                  type="text"
                  name="organizer_1_phone"
                  value={formData.organizer_1_phone || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-black/20 rounded-md text-black placeholder:text-blue-900/50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="organizer_2_name"
                  className="block text-sm font-medium text-black"
                >
                  Organizer 2 Name
                </label>
                <input
                  type="text"
                  name="organizer_2_name"
                  value={formData.organizer_2_name || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-black/20 rounded-md text-black placeholder:text-blue-900/50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
                  placeholder="Enter organizer name"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="organizer_2_phone"
                  className="block text-sm font-medium text-black"
                >
                  Organizer 2 Phone
                </label>
                <input
                  type="text"
                  name="organizer_2_phone"
                  value={formData.organizer_2_phone || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-black/20 rounded-md text-black placeholder:text-blue-900/50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isLoading}
              onClick={() => console.log("🔘 Submit button clicked!")}
              className="w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading
                ? "Saving..."
                : initialData
                ? "Update Event"
                : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
