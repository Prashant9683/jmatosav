import Image from "next/image";

// Placeholder data for past festivals
const pastFestivals = [
  {
    year: 2025,
    galleryUrl: "#",
    previewImageUrl:
      "https://placehold.co/600x400/334155/e2e8f0?text=Festival+2025",
  },
  {
    year: 2024,
    galleryUrl: "#",
    previewImageUrl:
      "https://placehold.co/600x400/334155/e2e8f0?text=Festival+2024",
  },
];

export default function HighlightsPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-4xl font-bold text-center mb-12">
        Past Festival Highlights
      </h1>
      <div className="space-y-12">
        {pastFestivals.map((festival) => (
          <section key={festival.year} className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">
              Memories from {festival.year}
            </h2>
            <Image
              src={festival.previewImageUrl}
              alt={`Highlights from ${festival.year}`}
              width={800}
              height={400}
              className="w-full h-auto rounded-md shadow-lg mb-4"
            />
            <a
              href={festival.galleryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              View Full Gallery
            </a>
          </section>
        ))}
      </div>
    </div>
  );
}
