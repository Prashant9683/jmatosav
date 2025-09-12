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
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-500"></div>
            <span className="ml-3 font-sans text-lg text-neutral-600">
              Loading event details...
            </span>
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
          {/* Gradient overlay for better readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/50 via-transparent to-transparent" />
        </div>
      )}

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Event Header */}
        <div className="mb-8">
          {/* Category Badge */}
          {event.category && (
            <div className="mb-4">
              <span className="inline-block rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700">
                {event.category}
              </span>
            </div>
          )}

          {/* Event Title */}
          <h1 className="font-heading text-4xl font-bold text-neutral-900 md:text-5xl">
            {title}
          </h1>

          {/* Event Meta Information */}
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {/* Venue */}
            {venue && (
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                  <svg
                    className="h-5 w-5 text-neutral-600"
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
                  <p className="font-sans text-sm font-medium text-neutral-500">
                    Venue
                  </p>
                  <p className="font-sans text-base text-neutral-900">
                    {venue}
                  </p>
                </div>
              </div>
            )}

            {/* Date */}
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                <svg
                  className="h-5 w-5 text-neutral-600"
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
                <p className="font-sans text-sm font-medium text-neutral-500">
                  Date
                </p>
                <p className="font-sans text-base text-neutral-900">
                  {eventDate}
                </p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                <svg
                  className="h-5 w-5 text-neutral-600"
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
                <p className="font-sans text-sm font-medium text-neutral-500">
                  Time
                </p>
                <p className="font-sans text-base text-neutral-900">
                  {startTime} {endTime && `- ${endTime}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Event Description */}
        {description && (
          <div className="mb-8">
            <h2 className="font-heading text-2xl font-semibold text-neutral-900 mb-4">
              About This Event
            </h2>
            <div className="prose prose-neutral max-w-none">
              <p className="font-sans text-lg leading-relaxed text-neutral-700 whitespace-pre-wrap">
                {description}
              </p>
            </div>
          </div>
        )}

        {/* Rules & Regulations Section */}
        {rules && (
          <div className="mb-8">
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                  <svg
                    className="h-5 w-5 text-primary-600"
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
                <h2 className="font-heading text-2xl font-semibold text-neutral-900">
                  Rules & Regulations
                </h2>
              </div>
              <div className="prose prose-neutral max-w-none">
                <p className="font-sans text-base leading-relaxed text-neutral-700 whitespace-pre-wrap">
                  {rules}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Registration Section */}
        <div className="sticky bottom-0 bg-white/80 backdrop-blur-sm border-t border-neutral-200 p-6 -mx-4 sm:-mx-6 lg:-mx-8">
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
