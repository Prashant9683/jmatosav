import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import type { Database } from "@/types/supabase";

interface EventDetailPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { id, locale } = await params;
  
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch the single event matching the ID from the URL
  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", parseInt(id))
    .single();

  if (error || !event) {
    // If no event is found, show the 404 page
    notFound();
  }

  // Choose language based on locale
  const title = locale === "hi" ? event.title_hi : event.title_en;
  const description =
    locale === "hi" ? event.description_hi : event.description_en;
  const rules = locale === "hi" ? event.rules_hi : event.rules_en;
  const venue = locale === "hi" ? event.venue_hi : event.venue_en;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {event.image_url && (
        <img
          src={event.image_url}
          alt={title || ""}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      )}
      <h1 className="text-4xl font-extrabold mb-2">{title}</h1>
      <p className="text-lg text-gray-400 mb-4">{`Venue: ${venue}`}</p>
      <p className="text-lg text-gray-300 mb-6">{description}</p>

      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Rules & Regulations</h2>
        <p className="text-gray-300 whitespace-pre-wrap">{rules}</p>
      </div>

      {/* We will add real logic to this button in a later module */}
      <button className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
        Register for this Event
      </button>
    </div>
  );
}
