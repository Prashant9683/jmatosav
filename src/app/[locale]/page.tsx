import { createClient } from "@supabase/supabase-js";
import { EventCard } from "@/components/EventCard";
import { Card } from "@/components/ui/card";
import type { Database } from "@/types/supabase";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch all events from the database with registration counts
  const { data: events, error } = await supabase.from("events").select(`
      *,
      registrations(count)
    `);

  if (error) {
    console.error("Error fetching events:", error);
  }

  // Process events to include registration counts
  const eventsWithCounts =
    events?.map((event) => ({
      ...event,
      current_registrations: event.registrations?.[0]?.count || 0,
    })) || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="bg-white border-b border-black/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-2">
              JALORE MAHOTSAV
            </h1>
            <p className="text-lg text-black/70">Cultural Festival 2024</p>
          </div>
        </div>
      </section>

      {/* Most Popular Events */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-black mb-4">
            Most Popular Events
          </h2>
          <p className="text-black/70 mb-8">
            These events are in high demand. Register early to avoid
            disappointment.
          </p>

          {eventsWithCounts && eventsWithCounts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {eventsWithCounts.slice(0, 8).map((event) => (
                <EventCard key={event.id} event={event} locale={locale} />
              ))}
            </div>
          ) : (
            <Card className="bg-white border border-black/10 p-12 shadow-md text-center max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="h-10 w-10 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">
                Events Coming Soon!
              </h3>
              <p className="text-black mb-6">
                We&apos;re preparing an incredible lineup of cultural events,
                performances, and activities. Stay tuned for announcements!
              </p>
            </Card>
          )}
        </div>
      </section>

      {/* All Events */}
      {eventsWithCounts && eventsWithCounts.length > 8 && (
        <section className="py-12 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-black mb-4">All Events</h2>
            <p className="text-black/70 mb-8">
              Didn&apos;t find what you&apos;re looking for? Browse all events
              here.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {eventsWithCounts.map((event) => (
                <EventCard key={event.id} event={event} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
