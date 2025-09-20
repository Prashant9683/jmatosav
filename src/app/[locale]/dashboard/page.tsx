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
  const [cancellingRegistration, setCancellingRegistration] = useState<
    number | null
  >(null);

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setLocale(resolvedParams.locale);
    };
    getParams();
  }, [params]);

  const handleCancelRegistration = async (registrationId: number) => {
    if (
      !confirm(
        "Are you sure you want to cancel this registration? This action cannot be undone."
      )
    ) {
      return;
    }

    setCancellingRegistration(registrationId);

    try {
      // Get the current session token
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        alert("You must be logged in to cancel registrations.");
        return;
      }

      const response = await fetch("/api/registrations/revoke", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          registrationId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Remove the cancelled registration from state
        setRegistrations((prev) =>
          prev.filter((reg) => reg.id !== registrationId)
        );

        // Remove the event if it was the only registration for that event
        setEvents((prev) => {
          const remainingRegistrations = registrations.filter(
            (reg) => reg.id !== registrationId
          );
          const eventIds = remainingRegistrations.map((reg) => reg.event_id);
          return prev.filter((event) => eventIds.includes(event.id));
        });

        alert("Registration cancelled successfully!");
      } else {
        alert(
          data.message || "Failed to cancel registration. Please try again."
        );
      }
    } catch (error) {
      console.error("Error cancelling registration:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setCancellingRegistration(null);
    }
  };

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
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-blue-900/70 font-medium">
              Loading your dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">My Dashboard</h1>
          <p className="text-lg text-blue-900/70">
            Manage your event registrations and view your tickets
          </p>
        </div>

        {/* Events Section */}
        <div className="bg-white border border-black/10 rounded-lg p-8 shadow-md">
          <h2 className="text-2xl font-semibold text-black mb-6 flex items-center">
            <span className="w-2 h-6 bg-blue-600 mr-3 rounded"></span>
            My Registered Events
          </h2>

          {events && events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event) => {
                const title = locale === "hi" ? event.title_hi : event.title_en;
                const venue = locale === "hi" ? event.venue_hi : event.venue_en;
                const registration = registrations.find(
                  (r) => r.event_id === event.id
                );

                return (
                  <div
                    key={event.id}
                    className="bg-white border border-black/10 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-black mb-2">
                          {title}
                        </h3>
                        <div className="flex items-center text-blue-900/70 mb-1">
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {venue || "Venue TBA"}
                        </div>
                        <div className="flex items-center text-blue-900/70">
                          <svg
                            className="w-4 h-4 mr-2"
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
                          {new Date(event.event_date).toLocaleDateString(
                            locale === "hi" ? "hi-IN" : "en-US"
                          )}
                          {event.start_time && ` at ${event.start_time}`}
                        </div>
                      </div>

                      <div className="flex gap-3 flex-wrap">
                        <Link
                          href={`/${locale}/events/${event.id}`}
                          className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                        >
                          View Details
                        </Link>
                        {registration && (
                          <>
                            <Link
                              href={`/${locale}/ticket/${registration.id}`}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center"
                            >
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                                />
                              </svg>
                              View Ticket
                            </Link>
                            <button
                              onClick={() =>
                                handleCancelRegistration(registration.id)
                              }
                              disabled={
                                cancellingRegistration === registration.id
                              }
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {cancellingRegistration === registration.id ? (
                                <>
                                  <svg
                                    className="w-4 h-4 mr-2 animate-spin"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                  </svg>
                                  Cancelling...
                                </>
                              ) : (
                                <>
                                  <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                  Cancel Registration
                                </>
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
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
              <h3 className="text-xl font-semibold text-black mb-2">
                No Events Yet
              </h3>
              <p className="text-blue-900/70 mb-6">
                You haven&apos;t registered for any events yet.
              </p>
              <Link
                href={`/${locale}/`}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Explore Events
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
