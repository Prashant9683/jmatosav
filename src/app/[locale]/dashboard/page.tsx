import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Database } from "@/types/supabase";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Check for an active user session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no user is logged in, redirect them to the login page
  if (!session) {
    redirect(`/${locale}/login`);
  }

  // 1. Get all event IDs the user has registered for
  const { data: registrations, error: regError } = await supabase
    .from("registrations")
    .select("event_id")
    .eq("user_id", session.user.id);

  if (regError) {
    console.error("Error fetching registrations:", regError);
    return <p>Error loading your events.</p>;
  }

  const eventIds = registrations.map((r) => r.event_id);

  // 2. Fetch the full details for those events
  const { data: events, error: eventsError } = await supabase
    .from("events")
    .select("*")
    .in("id", eventIds);

  if (eventsError) {
    console.error("Error fetching event details:", eventsError);
    return <p>Error loading your events.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">My Registered Events</h1>
      {events && events.length > 0 ? (
        <ul className="space-y-4">
          {events.map((event) => {
            const title = locale === "hi" ? event.title_hi : event.title_en;
            const venue = locale === "hi" ? event.venue_hi : event.venue_en;
            return (
              <li
                key={event.id}
                className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <h2 className="text-xl font-bold">{title}</h2>
                  <p className="text-gray-400">{venue}</p>
                </div>
                <Link
                  href={`/${locale}/events/${event.id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  View
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>You have not registered for any events yet.</p>
      )}
    </div>
  );
}
