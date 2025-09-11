import OrganizerCard from "@/components/OrganizerCard";

// Placeholder data for the organizers
const organizers = [
  {
    name: "Dr. Admin Name",
    title: "District Collector",
    imageUrl: "https://placehold.co/256x256/334155/e2e8f0?text=Admin+1",
  },
  {
    name: "Organizer Two",
    title: "Event Coordinator",
    imageUrl: "https://placehold.co/256x256/334155/e2e8f0?text=Admin+2",
  },
  {
    name: "Organizer Three",
    title: "Cultural Head",
    imageUrl: "https://placehold.co/256x256/334155/e2e8f0?text=Admin+3",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-4xl font-bold text-center mb-4">
        About the Festival
      </h1>
      <p className="text-center text-gray-400 mb-12">
        This is a placeholder description for the Jalore Mahotsav. Here we can
        write about the mission, vision, and history of this grand celebration
        of culture and sports.
      </p>

      <h2 className="text-3xl font-bold text-center mb-8">Meet the Team</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {organizers.map((organizer) => (
          <OrganizerCard key={organizer.name} {...organizer} />
        ))}
      </div>
    </div>
  );
}
