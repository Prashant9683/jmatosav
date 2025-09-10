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
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center">Loading...</div>
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

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {event.image_url && (
        <Image
          src={event.image_url}
          alt={title || ""}
          width={1200}
          height={256}
          className="w-full h-64 object-cover rounded-lg mb-6"
          priority
        />
      )}
      <h1 className="text-4xl font-extrabold mb-2">{title}</h1>
      <p className="text-lg text-gray-400 mb-4">{`Venue: ${venue}`}</p>
      <p className="text-lg text-gray-300 mb-6">{description}</p>

      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Rules & Regulations</h2>
        <p className="text-gray-300 whitespace-pre-wrap">{rules}</p>
      </div>

      <RegisterButton eventId={event.id} isInitiallyRegistered={isRegistered} />
    </div>
  );
}
