"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import { createClient } from "@supabase/supabase-js";
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

      // Check Supabase client
      console.log("🔧 Supabase client:", supabase);

      // Try creating a fresh Supabase client
      console.log("🆕 Creating fresh Supabase client...");
      const freshSupabase = createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      console.log("🆕 Fresh Supabase client created:", freshSupabase);

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

      // Perform the Supabase operation
      console.log("🚀 Starting Supabase operation...");
      const startTime = Date.now();

      let data: unknown, error: unknown;
      try {
        if (initialData) {
          console.log("Performing UPDATE operation...");
          const result = await supabase
            .from("events")
            .update(formData)
            .eq("id", initialData.id)
            .select();
          data = result.data;
          error = result.error;
        } else {
          console.log("📝 Performing INSERT operation...");
          console.log("📝 Insert data:", formData);

          // Build a strongly-typed Insert payload
          const cleanedData: Database["public"]["Tables"]["events"]["Insert"] =
            {
              title_en: formData.title_en,
              title_hi: formData.title_hi,
              event_date: formData.event_date,
              start_time: formData.start_time,
              end_time: formData.end_time || null,
              description_en: formData.description_en || null,
              description_hi: formData.description_hi || null,
              rules_en: formData.rules_en || null,
              rules_hi: formData.rules_hi || null,
              venue_en: formData.venue_en || null,
              venue_hi: formData.venue_hi || null,
              image_url: formData.image_url || null,
              category: formData.category || null,
              organizer_1_name: formData.organizer_1_name || null,
              organizer_1_phone: formData.organizer_1_phone || null,
              organizer_2_name: formData.organizer_2_name || null,
              organizer_2_phone: formData.organizer_2_phone || null,
            };
          console.log("📝 Cleaned data:", cleanedData);

          // Test basic Supabase connection first with timeout using fresh client
          console.log(
            "🔍 Testing basic Supabase connection with fresh client..."
          );
          try {
            const testPromise = freshSupabase
              .from("events")
              .select("count")
              .limit(1);
            const testTimeout: Promise<never> = new Promise((_, reject) =>
              setTimeout(
                () => reject(new Error("Connection test timeout")),
                5000
              )
            );

            const testResult = await Promise.race([testPromise, testTimeout]);
            console.log("✅ Basic connection test result:", testResult);
          } catch (testErr) {
            console.error("❌ Basic connection test failed:", testErr);
            // If basic connection fails, we should stop here
            alert(
              "Database connection failed. Please check your internet connection and try again."
            );
            setIsLoading(false);
            return;
          }

          // Add timeout for INSERT operation - try without .select() first using fresh client
          const insertPromise = freshSupabase
            .from("events")
            .insert(cleanedData);

          const timeoutPromise: Promise<never> = new Promise((_, reject) =>
            setTimeout(
              () =>
                reject(new Error("INSERT operation timeout after 15 seconds")),
              15000
            )
          );

          console.log("⏰ Starting INSERT with timeout...");
          type InsertResult = Awaited<typeof insertPromise>;
          const result = (await Promise.race([
            insertPromise,
            timeoutPromise,
          ])) as InsertResult;
          console.log("📝 Insert result:", result);
          data = result.data;
          error = result.error;
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
      alert(`Event ${initialData ? "updated" : "created"} successfully!`);

      // Navigate back to admin dashboard
      router.push(`/${locale}/admin`);
      router.refresh();
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500";
  const labelClass = "block text-sm font-medium text-gray-300 mb-1";
  const textareaClass = `${inputClass} h-24`;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Bilingual Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title_en" className={labelClass}>
            Title (English)
          </label>
          <input
            type="text"
            id="title_en"
            name="title_en"
            value={formData.title_en}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label htmlFor="title_hi" className={labelClass}>
            Title (Hindi)
          </label>
          <input
            type="text"
            id="title_hi"
            name="title_hi"
            value={formData.title_hi}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label htmlFor="description_en" className={labelClass}>
            Description (English)
          </label>
          <textarea
            name="description_en"
            value={formData.description_en || ""}
            onChange={handleChange}
            className={textareaClass}
          ></textarea>
        </div>
        <div>
          <label htmlFor="description_hi" className={labelClass}>
            Description (Hindi)
          </label>
          <textarea
            name="description_hi"
            value={formData.description_hi || ""}
            onChange={handleChange}
            className={textareaClass}
          ></textarea>
        </div>
        <div>
          <label htmlFor="rules_en" className={labelClass}>
            Rules (English)
          </label>
          <textarea
            name="rules_en"
            value={formData.rules_en || ""}
            onChange={handleChange}
            className={textareaClass}
          ></textarea>
        </div>
        <div>
          <label htmlFor="rules_hi" className={labelClass}>
            Rules (Hindi)
          </label>
          <textarea
            name="rules_hi"
            value={formData.rules_hi || ""}
            onChange={handleChange}
            className={textareaClass}
          ></textarea>
        </div>
        <div>
          <label htmlFor="venue_en" className={labelClass}>
            Venue (English)
          </label>
          <input
            type="text"
            name="venue_en"
            value={formData.venue_en || ""}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="venue_hi" className={labelClass}>
            Venue (Hindi)
          </label>
          <input
            type="text"
            name="venue_hi"
            value={formData.venue_hi || ""}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <hr className="border-gray-600" />

      {/* General Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label htmlFor="event_date" className={labelClass}>
            Event Date
          </label>
          <input
            type="date"
            id="event_date"
            name="event_date"
            value={formData.event_date}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label htmlFor="start_time" className={labelClass}>
            Start Time
          </label>
          <input
            type="time"
            id="start_time"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label htmlFor="end_time" className={labelClass}>
            End Time (Optional)
          </label>
          <input
            type="time"
            name="end_time"
            value={formData.end_time || ""}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="category" className={labelClass}>
            Category
          </label>
          <input
            type="text"
            name="category"
            value={formData.category || ""}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <label htmlFor="image_url" className={labelClass}>
            Image URL (Optional)
          </label>
          <input
            type="url"
            name="image_url"
            value={formData.image_url || ""}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <hr className="border-gray-600" />

      {/* Organizer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="organizer_1_name" className={labelClass}>
            Organizer 1 Name
          </label>
          <input
            type="text"
            name="organizer_1_name"
            value={formData.organizer_1_name || ""}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="organizer_1_phone" className={labelClass}>
            Organizer 1 Phone
          </label>
          <input
            type="text"
            name="organizer_1_phone"
            value={formData.organizer_1_phone || ""}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="organizer_2_name" className={labelClass}>
            Organizer 2 Name
          </label>
          <input
            type="text"
            name="organizer_2_name"
            value={formData.organizer_2_name || ""}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="organizer_2_phone" className={labelClass}>
            Organizer 2 Phone
          </label>
          <input
            type="text"
            name="organizer_2_phone"
            value={formData.organizer_2_phone || ""}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        onClick={() => console.log("🔘 Submit button clicked!")}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading
          ? "Saving..."
          : initialData
          ? "Update Event"
          : "Create Event"}
      </button>
    </form>
  );
}
