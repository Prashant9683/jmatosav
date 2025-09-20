import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Placeholder data for past festivals
const pastFestivals = [
  {
    year: 2025,
    galleryUrl: "#",
    previewImageUrl:
      "https://placehold.co/600x400/2563eb/ffffff?text=Festival+2025",
    description:
      "An incredible celebration of culture, art, and community spirit that brought together thousands of participants.",
    highlights: [
      "500+ participants",
      "20+ cultural performances",
      "3-day festival",
    ],
  },
  {
    year: 2024,
    galleryUrl: "#",
    previewImageUrl:
      "https://placehold.co/600x400/2563eb/ffffff?text=Festival+2024",
    description:
      "A memorable year featuring traditional dances, local artisans, and unforgettable musical performances.",
    highlights: [
      "400+ participants",
      "15+ cultural performances",
      "2-day festival",
    ],
  },
];

export default function HighlightsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-black mb-6">
            Past Festival Highlights
          </h1>
          <p className="text-lg text-blue-900/70 max-w-3xl mx-auto">
            Relive the magical moments from previous years of Jalore Mahotsav.
            Each year brings new experiences, unforgettable performances, and
            lasting memories for our community.
          </p>
        </div>

        {/* Festival Years */}
        <div className="space-y-16">
          {pastFestivals.map((festival) => (
            <Card
              key={festival.year}
              className="bg-white border border-black/10 shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
            >
              <div className="md:flex">
                {/* Image Section */}
                <div className="md:w-1/2">
                  <Image
                    src={festival.previewImageUrl}
                    alt={`Highlights from ${festival.year}`}
                    width={800}
                    height={400}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>

                {/* Content Section */}
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center mb-4">
                    <span className="w-2 h-8 bg-blue-600 mr-3 rounded"></span>
                    <h2 className="text-3xl font-bold text-black">
                      Festival {festival.year}
                    </h2>
                  </div>

                  <p className="text-black mb-6 leading-relaxed">
                    {festival.description}
                  </p>

                  {/* Statistics */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-black mb-3">
                      Festival Highlights
                    </h3>
                    <div className="space-y-2">
                      {festival.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-center">
                          <svg
                            className="w-4 h-4 text-blue-600 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-blue-900/70">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    asChild
                    className="bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <a
                      href={festival.galleryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center"
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
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      View Full Gallery
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <div className="bg-white border border-black/10 rounded-lg p-8 shadow-md">
            <h3 className="text-2xl font-bold text-black mb-4">
              Join Us This Year!
            </h3>
            <p className="text-blue-900/70 mb-6 max-w-2xl mx-auto">
              Don&apos;t miss out on creating new memories at this year&apos;s
              Jalore Mahotsav. Register for events and be part of our growing
              cultural community.
            </p>
            <Button
              asChild
              className="bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Link href="/#events">Explore This Year&apos;s Events</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
