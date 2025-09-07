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
    <Link href={`/events/${event.id}`}>
      <Card className="overflow-hidden bg-card border-border hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        {/* Image Container with 16:9 aspect ratio */}
        <div className="relative w-full aspect-video overflow-hidden">
          <Image
            src={event.image_url || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <CardContent className="p-6 space-y-4">
          {/* Title and Category */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-card-foreground leading-tight">
              {title}
            </h3>
            <Badge
              variant="secondary"
              className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground"
            >
              {category}
            </Badge>
          </div>

          {/* Description with 3-line truncation */}
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
            {description}
          </p>

          {/* Right-aligned button */}
          <div className="flex justify-end pt-2">
            <Button
              variant="default"
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
