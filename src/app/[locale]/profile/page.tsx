"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase-client";
import ProfileForm from "@/components/ProfileForm";

interface ProfilePageProps {
  params: Promise<{ locale: string }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const router = useRouter();
  const { session, loading } = useAuth();
  const [locale, setLocale] = useState<string>("");
  const [profile, setProfile] = useState<{
    full_name: string | null;
    email: string | null;
  } | null>(null);
  const [pastEvents, setPastEvents] = useState<
    Array<{
      id: number;
      event_id: number;
      created_at: string;
      events:
        | {
            id: number;
            title_en: string;
            title_hi: string;
            event_date: string;
            start_time: string;
            venue_en: string;
            venue_hi: string;
          }[]
        | null;
    }>
  >([]);
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

      // Fetch user's profile and past events
      const fetchProfileData = async () => {
        try {
          // Fetch the current user's profile data
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("full_name, email")
            .eq("id", session.user.id)
            .single();

          if (profileError) {
            console.error("Error fetching profile:", profileError);
            return;
          }

          setProfile(profileData);

          // Fetch all of the user's registrations with associated events data where event_date is in the past
          const { data: pastRegistrations, error: registrationsError } =
            await supabase
              .from("registrations")
              .select(
                `
              id,
              event_id,
              created_at,
              events (
                id,
                title_en,
                title_hi,
                event_date,
                start_time,
                venue_en,
                venue_hi
              )
            `
              )
              .eq("user_id", session.user.id)
              .lt("events.event_date", new Date().toISOString().split("T")[0]); // Events before today

          if (registrationsError) {
            console.error(
              "Error fetching past registrations:",
              registrationsError
            );
          }

          setPastEvents(pastRegistrations || []);
        } catch (error) {
          console.error("Error fetching profile data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchProfileData();
    }
  }, [session, loading, locale, router]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-blue-900/70 font-medium">
              Loading your profile...
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
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">My Profile</h1>
          <p className="text-lg text-blue-900/70">
            Manage your personal information and view your event history
          </p>
        </div>

        <div className="space-y-12">
          {/* Edit Your Information Section */}
          <div className="bg-white border border-black/10 rounded-lg p-8 shadow-md">
            <h2 className="text-2xl font-semibold text-black mb-6 flex items-center">
              <span className="w-2 h-6 bg-blue-600 mr-3 rounded"></span>
              Edit Your Information
            </h2>
            <ProfileForm initialData={profile || { full_name: null }} />
          </div>

          {/* My Photos Section */}
          <div className="bg-white border border-black/10 rounded-lg p-8 shadow-md">
            <h2 className="text-2xl font-semibold text-black mb-6 flex items-center">
              <span className="w-2 h-6 bg-blue-600 mr-3 rounded"></span>
              My Photos
            </h2>
            <div className="text-center py-8">
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
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-blue-900/70 mb-6">
                Event photos are managed externally. Find your photos from
                Jalore Mahotsav events.
              </p>
              <a
                href="https://kwikpic.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Find My Photos on Kwikpic
              </a>
            </div>
          </div>

          {/* Past Event Participation Section */}
          <div className="bg-white border border-black/10 rounded-lg p-8 shadow-md">
            <h2 className="text-2xl font-semibold text-black mb-6 flex items-center">
              <span className="w-2 h-6 bg-blue-600 mr-3 rounded"></span>
              Past Event Participation
            </h2>

            {pastEvents &&
            pastEvents.filter((registration) => registration.events).length >
              0 ? (
              <div className="space-y-4">
                {pastEvents
                  .filter((registration) => registration.events) // Filter out registrations with null events
                  .map((registration) => {
                    const event = registration.events?.[0];
                    const title =
                      locale === "hi" ? event?.title_hi : event?.title_en;
                    const venue =
                      locale === "hi" ? event?.venue_hi : event?.venue_en;

                    return (
                      <div
                        key={registration.id}
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
                              {event?.event_date &&
                                new Date(event.event_date).toLocaleDateString(
                                  locale === "hi" ? "hi-IN" : "en-US"
                                )}
                              {event?.start_time && ` at ${event.start_time}`}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                              Participated
                            </span>
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
                  No Past Events
                </h3>
                <p className="text-blue-900/70">
                  You haven&apos;t participated in any past events yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
