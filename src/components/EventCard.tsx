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
      <Card className="relative h-full overflow-hidden border border-black/10 bg-white shadow-md transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
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

          {/* Category Badge positioned on image */}
          {category && (
            <div className="absolute top-3 right-3">
              <Badge
                variant="secondary"
                className="bg-white text-blue-900 border border-blue-200 backdrop-blur-sm font-semibold shadow-sm"
              >
                {category}
              </Badge>
            </div>
          )}
        </div>

        {/* Card Content */}
        <CardContent className="flex h-full flex-col p-6">
          <div className="flex-1 space-y-3">
            {/* Event Title */}
            <h3 className="text-xl font-bold text-black leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
              {title}
            </h3>

            {/* Event Description */}
            <p className="text-sm text-black leading-relaxed line-clamp-3">
              {description}
            </p>
          </div>

          {/* Action Button */}
          <div className="mt-4 flex justify-end">
            <Button
              variant="default"
              size="sm"
              className="bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 font-semibold"
            >
              View Details
            </Button>
          </div>
        </CardContent>

        {/* Subtle border accent on hover */}
        <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-blue-200 transition-colors duration-300 pointer-events-none" />
      </Card>
    </Link>
  );
}
