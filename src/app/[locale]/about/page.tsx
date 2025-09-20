import OrganizerCard from "@/components/OrganizerCard";

// Placeholder data for the organizers
const organizers = [
  {
    name: "Dr. Admin Name",
    title: "District Collector",
    imageUrl: "https://placehold.co/256x256/2563eb/ffffff?text=Admin+1",
  },
  {
    name: "Organizer Two",
    title: "Event Coordinator",
    imageUrl: "https://placehold.co/256x256/2563eb/ffffff?text=Admin+2",
  },
  {
    name: "Organizer Three",
    title: "Cultural Head",
    imageUrl: "https://placehold.co/256x256/2563eb/ffffff?text=Admin+3",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-black mb-6">
            About the Festival
          </h1>
          <p className="text-lg text-blue-900/70 max-w-3xl mx-auto">
            Jalore Mahotsav is a grand celebration of culture, tradition, and
            community spirit. This magnificent festival brings together artists,
            performers, and cultural enthusiasts from across the region to
            celebrate the rich heritage of Jalore through music, dance, art, and
            various cultural activities.
          </p>
        </div>

        {/* Mission & Vision Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="bg-white border border-black/10 rounded-lg p-8 shadow-md">
            <h3 className="text-2xl font-semibold text-black mb-4 flex items-center">
              <span className="w-2 h-6 bg-blue-600 mr-3 rounded"></span>
              Our Mission
            </h3>
            <p className="text-black leading-relaxed">
              To preserve and promote the cultural heritage of Jalore while
              fostering community engagement and artistic expression through a
              world-class festival that celebrates diversity and unity.
            </p>
          </div>

          <div className="bg-white border border-black/10 rounded-lg p-8 shadow-md">
            <h3 className="text-2xl font-semibold text-black mb-4 flex items-center">
              <span className="w-2 h-6 bg-blue-600 mr-3 rounded"></span>
              Our Vision
            </h3>
            <p className="text-black leading-relaxed">
              To establish Jalore Mahotsav as the premier cultural festival in
              the region, creating lasting memories and meaningful connections
              while showcasing the vibrant traditions and contemporary
              expressions of our community.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black mb-4">Meet the Team</h2>
          <p className="text-blue-900/70 max-w-2xl mx-auto">
            Our dedicated team of organizers and coordinators work tirelessly to
            bring this incredible festival to life every year.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {organizers.map((organizer) => (
            <OrganizerCard key={organizer.name} {...organizer} />
          ))}
        </div>
      </div>
    </div>
  );
}
