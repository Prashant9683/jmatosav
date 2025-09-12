import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Database } from "@/types/supabase";

interface EventCardProps {
  event: Database["public"]["Tables"]["events"]["Row"];
  locale: string;
}

export function EventCard({ event, locale }: EventCardProps) {
  const title = locale === "hi" ? event.title_hi : event.title_en;
  const description =
    locale === "hi" ? event.description_hi : event.description_en;
  const category = event.category;

  return (
    <Link href={`/${locale}/events/${event.id}`} className="group block h-full">
      <div className="relative h-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 ease-in-out hover:border-gray-300 hover:shadow-lg hover:-translate-y-1">
        {/* Event Image with Gradient Overlay */}
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={event.image_url || "/file.svg"}
            alt={title || "Event image"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={event.id <= 4}
          />
          {/* Subtle gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-transparent" />

          {/* Category Badge positioned on image */}
          {category && (
            <div className="absolute top-3 right-3">
              <Badge
                variant="secondary"
                className="bg-white/95 text-gray-800 backdrop-blur-sm border-0 font-semibold shadow-sm"
              >
                {category}
              </Badge>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="flex h-full flex-col p-6">
          <div className="flex-1 space-y-3">
            {/* Event Title */}
            <h3 className="font-heading text-xl font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
              {title}
            </h3>

            {/* Event Description */}
            <p className="font-sans text-sm text-gray-700 leading-relaxed line-clamp-3">
              {description}
            </p>
          </div>

          {/* Action Button */}
          <div className="mt-4 flex justify-end">
            <Button
              variant="default"
              size="sm"
              className="bg-primary-500 text-white hover:bg-primary-600 transition-colors duration-200 font-heading font-semibold"
            >
              View Details
            </Button>
          </div>
        </div>

        {/* Subtle border accent on hover */}
        <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary-200 transition-colors duration-300 pointer-events-none" />
      </div>
    </Link>
  );
}
