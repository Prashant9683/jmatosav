import Image from "next/image";

const sponsors = {
  gold: [
    {
      name: "Gold Sponsor 1",
      logoUrl: "https://placehold.co/200x100/334155/e2e8f0?text=Sponsor",
    },
    {
      name: "Gold Sponsor 2",
      logoUrl: "https://placehold.co/200x100/334155/e2e8f0?text=Sponsor",
    },
  ],
  silver: [
    {
      name: "Silver Sponsor 1",
      logoUrl: "https://placehold.co/200x100/334155/e2e8f0?text=Sponsor",
    },
    {
      name: "Silver Sponsor 2",
      logoUrl: "https://placehold.co/200x100/334155/e2e8f0?text=Sponsor",
    },
    {
      name: "Silver Sponsor 3",
      logoUrl: "https://placehold.co/200x100/334155/e2e8f0?text=Sponsor",
    },
  ],
};

export default function SponsorsPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-4xl font-bold text-center mb-12">Our Sponsors</h1>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6">
          Gold Sponsors
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 items-center">
          {sponsors.gold.map((sponsor) => (
            <div
              key={sponsor.name}
              className="p-4 bg-gray-800 rounded-lg flex justify-center items-center"
            >
              <Image
                src={sponsor.logoUrl}
                alt={sponsor.name}
                width={200}
                height={64}
                className="max-h-16 w-full object-contain"
              />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-gray-400 mb-6">
          Silver Sponsors
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
          {sponsors.silver.map((sponsor) => (
            <div
              key={sponsor.name}
              className="p-4 bg-gray-800 rounded-lg flex justify-center items-center"
            >
              <Image
                src={sponsor.logoUrl}
                alt={sponsor.name}
                width={150}
                height={48}
                className="max-h-12 w-full object-contain"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
