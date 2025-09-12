import { createClient } from "@supabase/supabase-js";
import { getI18n } from "../../../i18n/server";
import { EventCard } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import type { Database } from "@/types/supabase";
import Link from "next/link";
import Image from "next/image";

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          {/* Gradient background as fallback */}
          <div className="absolute inset-0 bg-festival-gradient" />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/70 via-neutral-900/50 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex h-full items-center">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="font-heading text-5xl font-bold text-white md:text-6xl lg:text-7xl">
                {t("welcome_message")}
              </h1>
              <p className="mt-6 font-sans text-xl text-neutral-200 md:text-2xl">
                Experience the vibrant culture, traditions, and artistry of
                Jalore through our magnificent festival celebration.
              </p>

              {/* Call to Action Buttons */}
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link href={`/${locale}/events`}>
                  <Button
                    size="lg"
                    className="bg-primary-500 text-white hover:bg-primary-600 w-full sm:w-auto font-heading font-semibold"
                  >
                    Explore Events
                  </Button>
                </Link>
                <Link href={`/${locale}/about`}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-gray-900 w-full sm:w-auto font-heading font-semibold"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex h-6 w-4 items-end justify-center rounded-full border-2 border-white/60">
            <div className="h-2 w-1 rounded-full bg-white/60"></div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <h2 className="font-heading text-4xl font-bold text-neutral-900 md:text-5xl">
              Festival Events
            </h2>
            <p className="mt-4 font-sans text-lg text-neutral-600 md:text-xl">
              Discover the exciting lineup of cultural performances,
              exhibitions, and celebrations
            </p>
          </div>

          {/* Events Grid */}
          {events && events.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} locale={locale} />
              ))}
            </div>
          ) : (
            <div className="text-center">
              <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-neutral-100 flex items-center justify-center">
                <svg
                  className="h-12 w-12 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="font-heading text-xl font-semibold text-neutral-900">
                No Events Available
              </h3>
              <p className="mt-2 font-sans text-neutral-600">
                Check back soon for exciting festival events!
              </p>
            </div>
          )}

          {/* View All Events Button */}
          {events && events.length > 0 && (
            <div className="mt-16 text-center">
              <Link href={`/${locale}/events`}>
                <Button size="lg" variant="outline">
                  View All Events
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
