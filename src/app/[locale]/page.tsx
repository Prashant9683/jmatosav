import { createClient } from "@supabase/supabase-js";
import { getI18n } from "../../../i18n/server";
import { EventCard } from "@/components/EventCard";
import type { Database } from "@/types/supabase";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getI18n();
  
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch all events from the database
  const { data: events, error } = await supabase.from("events").select("*");

  if (error) {
    console.error("Error fetching events:", error);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">{t("welcome_message")}</h1>

      {/* Responsive Grid for Event Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {events && events.length > 0 ? (
          events.map((event) => (
            <EventCard key={event.id} event={event} locale={locale} />
          ))
        ) : (
          <p>No events found.</p>
        )}
      </div>
    </div>
  );
}
