import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Database } from "@/types/supabase";

interface EventCardProps {
  event: Database["public"]["Tables"]["events"]["Row"] & {
    current_registrations?: number;
  };
  locale: string;
}

export function EventCard({ event, locale }: EventCardProps) {
  const title = locale === "hi" ? event.title_hi : event.title_en;
  const description =
    locale === "hi" ? event.description_hi : event.description_en;
  const category = event.category;

  // Determine event status based on registrations and max participants
  const currentRegistrations = event.current_registrations || 0;
  const maxParticipants = event.max_participants;

  let eventStatus: "available" | "filling_fast" | "sold_out" = "available";
  let statusTag = null;

  if (maxParticipants) {
    if (currentRegistrations >= maxParticipants) {
      eventStatus = "sold_out";
      statusTag = (
        <div className="absolute top-3 left-3">
          <Badge className="bg-red-500 text-white border-0 font-semibold shadow-sm">
            Sold Out
          </Badge>
        </div>
      );
    } else if (currentRegistrations >= maxParticipants * 0.8) {
      eventStatus = "filling_fast";
      statusTag = (
        <div className="absolute top-3 left-3">
          <Badge className="bg-orange-500 text-white border-0 font-semibold shadow-sm">
            Filling Fast
          </Badge>
        </div>
      );
    }
  }

  return (
    <Link href={`/${locale}/events/${event.id}`} className="group block">
      <Card className="relative overflow-hidden border border-black/10 bg-white transition-all duration-300 ease-in-out hover:shadow-lg">
        {/* Event Image */}
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={event.image_url || "/file.svg"}
            alt={title || "Event image"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={event.id <= 4}
          />

          {/* Status Tag */}
          {statusTag}

          {/* Category Badge positioned on image */}
          {category && (
            <div className="absolute top-3 right-3">
              <Badge
                variant="secondary"
                className="bg-white text-gray-700 border border-gray-300 font-semibold"
              >
                {category}
              </Badge>
            </div>
          )}
        </div>

        {/* Card Content */}
        <CardContent className="p-4">
          {/* Event Title */}
          <h3 className="text-lg font-bold text-black leading-tight line-clamp-2 mb-2">
            {title}
          </h3>

          {/* Event Description */}
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-3">
            {description}
          </p>

          {/* Event Date */}
          {event.event_date && (
            <div className="text-xs text-gray-500 mb-2">
              {new Date(event.event_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          )}

          {/* Action Button */}
          <div className="mt-3">
            <Button
              variant="default"
              size="sm"
              className={`w-full transition-all duration-200 font-semibold ${
                eventStatus === "sold_out"
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
              disabled={eventStatus === "sold_out"}
            >
              {eventStatus === "sold_out" ? "Sold Out" : "Register Now"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
