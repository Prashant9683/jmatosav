"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Tables } from "@/types/supabase";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase-client";

type Registration = Tables<"registrations">;
type Event = Tables<"events">;

interface DashboardPageProps {
  params: Promise<{ locale: string }>;
}

export default function DashboardPage({ params }: DashboardPageProps) {
  const router = useRouter();
  const { session, loading } = useAuth();
  const [locale, setLocale] = useState<string>("");
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setLocale(resolvedParams.locale);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!loading) {
      if (!session) {
        router.push(`/${locale}/login`);
        return;
      }

      // Fetch user's registered events
      const fetchRegisteredEvents = async () => {
        try {
          // 1. Get all event IDs the user has registered for
          const { data: userRegistrations, error: regError } = await supabase
            .from("registrations")
            .select("id, event_id")
            .eq("user_id", session.user.id);

          if (regError) {
            console.error("Error fetching registrations:", regError);
            return;
          }

          setRegistrations((userRegistrations as Registration[]) || []);
          const eventIds = (userRegistrations || []).map((r) => r.event_id);

          // 2. Fetch the full details for those events
          if (eventIds.length > 0) {
            const { data: userEvents, error: eventsError } = await supabase
              .from("events")
              .select("*")
              .in("id", eventIds);

            if (eventsError) {
              console.error("Error fetching event details:", eventsError);
              return;
            }

            setEvents(userEvents || []);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchRegisteredEvents();
    }
  }, [session, loading, locale, router]);

  if (loading || isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">My Registered Events</h1>
      {events && events.length > 0 ? (
        <ul className="space-y-4">
          {events.map((event) => {
            const title = locale === "hi" ? event.title_hi : event.title_en;
            const venue = locale === "hi" ? event.venue_hi : event.venue_en;
            const registration = registrations.find(
              (r) => r.event_id === event.id
            );
            return (
              <li
                key={event.id}
                className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <h2 className="text-xl font-bold">{title}</h2>
                  <p className="text-gray-400">{venue}</p>
                </div>
                {registration && (
                  <Link
                    href={`/${locale}/ticket/${registration.id}`}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    View Ticket
                  </Link>
                )}
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
