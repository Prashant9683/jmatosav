"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import type { Tables } from "@/types/supabase";
import RegisterButton from "@/components/RegisterButton";
import Image from "next/image";
import { supabase } from "@/lib/supabase-client";
import { useAuth } from "@/components/AuthProvider";

type Event = Tables<"events">;

interface EventDetailPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const { session } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [locale, setLocale] = useState<string>("");
  const [eventId, setEventId] = useState<string>("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setLocale(resolvedParams.locale);
      setEventId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (eventId) {
      const fetchEvent = async () => {
        try {
          // Fetch the single event matching the ID from the URL
          const { data: eventData, error } = await supabase
            .from("events")
            .select("*")
            .eq("id", parseInt(eventId))
            .single();

          if (error || !eventData) {
            notFound();
            return;
          }

          setEvent(eventData);

          // Check if user is logged in and already registered
          if (session) {
            const { data: registration } = await supabase
              .from("registrations")
              .select("id")
              .eq("event_id", eventData.id)
              .eq("user_id", session.user.id)
              .single();

            setIsRegistered(!!registration);
          }
        } catch (error) {
          console.error("Error fetching event:", error);
          notFound();
        } finally {
          setLoading(false);
        }
      };

      fetchEvent();
    }
  }, [eventId, session]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-blue-900/70 font-medium">
              Loading event details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    notFound();
    return null;
  }

  // Choose language based on locale
  const title = locale === "hi" ? event.title_hi : event.title_en;
  const description =
    locale === "hi" ? event.description_hi : event.description_en;
  const rules = locale === "hi" ? event.rules_hi : event.rules_en;
  const venue = locale === "hi" ? event.venue_hi : event.venue_en;

  // Format date and time
  const eventDate = new Date(event.event_date).toLocaleDateString(
    locale === "hi" ? "hi-IN" : "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const startTime = event.start_time;
  const endTime = event.end_time;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image Banner */}
      {event.image_url && (
        <div className="relative h-80 w-full overflow-hidden md:h-96">
          <Image
            src={event.image_url}
            alt={title || "Event image"}
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Hero Content Overlay */}
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto max-w-4xl px-4 pb-8 sm:px-6 lg:px-8 w-full">
              {event.category && (
                <div className="mb-4">
                  <span className="inline-block rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-sm font-medium text-white border border-white/30">
                    {event.category}
                  </span>
                </div>
              )}
              <h1 className="text-4xl font-bold text-white md:text-5xl mb-2">
                {title}
              </h1>
              <p className="text-white/90 text-lg">
                Jalore Mahotsav Cultural Festival
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Event Header - Only show if no image */}
        {!event.image_url && (
          <div className="mb-8">
            {/* Category Badge */}
            {event.category && (
              <div className="mb-4">
                <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-900">
                  {event.category}
                </span>
              </div>
            )}

            {/* Event Title */}
            <h1 className="text-4xl font-bold text-black md:text-5xl mb-2">
              {title}
            </h1>
            <p className="text-blue-900/70 text-lg">
              Jalore Mahotsav Cultural Festival
            </p>
          </div>
        )}

        {/* Event Meta Information */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          {/* Venue */}
          {venue && (
            <div className="flex items-start gap-3 bg-white border border-black/10 rounded-lg p-4 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-600"
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
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900/70 mb-1">
                  Venue
                </p>
                <p className="text-base font-semibold text-black">{venue}</p>
              </div>
            </div>
          )}

          {/* Date */}
          <div className="flex items-start gap-3 bg-white border border-black/10 rounded-lg p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-600"
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
            <div>
              <p className="text-sm font-medium text-blue-900/70 mb-1">Date</p>
              <p className="text-base font-semibold text-black">{eventDate}</p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-start gap-3 bg-white border border-black/10 rounded-lg p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900/70 mb-1">Time</p>
              <p className="text-base font-semibold text-black">
                {startTime} {endTime && `- ${endTime}`}
              </p>
            </div>
          </div>
        </div>

        {/* Event Description */}
        {description && (
          <div className="mb-8 bg-white border border-black/10 rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-black mb-4 flex items-center">
              <span className="w-2 h-6 bg-blue-600 mr-3 rounded"></span>
              About This Event
            </h2>
            <p className="text-lg leading-relaxed text-black whitespace-pre-wrap">
              {description}
            </p>
          </div>
        )}

        {/* Rules & Regulations Section */}
        {rules && (
          <div className="mb-8">
            <div className="bg-white border border-blue-600 rounded-lg p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <svg
                    className="h-5 w-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-black">
                  Rules & Regulations
                </h2>
              </div>
              <p className="text-base leading-relaxed text-black whitespace-pre-wrap">
                {rules}
              </p>
            </div>
          </div>
        )}

        {/* Registration Section */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-black/10 p-6 -mx-4 sm:-mx-6 lg:-mx-8 shadow-lg">
          <div className="mx-auto max-w-4xl">
            <RegisterButton
              eventId={event.id}
              isInitiallyRegistered={isRegistered}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
