import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const sponsors = {
  gold: [
    {
      name: "Gold Sponsor 1",
      logoUrl: "https://placehold.co/200x100/2563eb/ffffff?text=Gold+1",
      description: "Premium partner supporting cultural excellence",
    },
    {
      name: "Gold Sponsor 2", 
      logoUrl: "https://placehold.co/200x100/2563eb/ffffff?text=Gold+2",
      description: "Committed to preserving heritage and traditions",
    },
  ],
  silver: [
    {
      name: "Silver Sponsor 1",
      logoUrl: "https://placehold.co/150x75/2563eb/ffffff?text=Silver+1",
      description: "Supporting arts and culture",
    },
    {
      name: "Silver Sponsor 2",
      logoUrl: "https://placehold.co/150x75/2563eb/ffffff?text=Silver+2", 
      description: "Promoting community engagement",
    },
    {
      name: "Silver Sponsor 3",
      logoUrl: "https://placehold.co/150x75/2563eb/ffffff?text=Silver+3",
      description: "Fostering cultural diversity",
    },
  ],
};

export default function SponsorsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-black mb-6">Our Sponsors</h1>
          <p className="text-lg text-blue-900/70 max-w-3xl mx-auto">
            We are grateful to our generous sponsors who make Jalore Mahotsav possible. 
            Their support enables us to celebrate culture, preserve traditions, and bring 
            our community together for this magnificent festival.
          </p>
        </div>

        {/* Gold Sponsors Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <span className="w-2 h-8 bg-yellow-500 mr-3 rounded"></span>
              <h2 className="text-3xl font-bold text-black">Gold Sponsors</h2>
            </div>
            <p className="text-blue-900/70">
              Our premier partners providing exceptional support
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sponsors.gold.map((sponsor) => (
              <Card
                key={sponsor.name}
                className="bg-white border border-black/10 p-8 shadow-md hover:shadow-lg transition-shadow duration-200 text-center"
              >
                <div className="mb-6">
                  <Image
                    src={sponsor.logoUrl}
                    alt={sponsor.name}
                    width={200}
                    height={100}
                    className="max-h-20 w-auto mx-auto object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">{sponsor.name}</h3>
                <p className="text-blue-900/70">{sponsor.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Silver Sponsors Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <span className="w-2 h-8 bg-gray-400 mr-3 rounded"></span>
              <h2 className="text-3xl font-bold text-black">Silver Sponsors</h2>
            </div>
            <p className="text-blue-900/70">
              Valued partners contributing to our cultural mission
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sponsors.silver.map((sponsor) => (
              <Card
                key={sponsor.name}
                className="bg-white border border-black/10 p-6 shadow-md hover:shadow-lg transition-shadow duration-200 text-center"
              >
                <div className="mb-4">
                  <Image
                    src={sponsor.logoUrl}
                    alt={sponsor.name}
                    width={150}
                    height={75}
                    className="max-h-16 w-auto mx-auto object-contain"
                  />
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">{sponsor.name}</h3>
                <p className="text-sm text-blue-900/70">{sponsor.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Become a Sponsor CTA */}
        <div className="text-center">
          <Card className="bg-white border border-black/10 p-8 shadow-md max-w-2xl mx-auto">
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Become a Sponsor</h3>
              <p className="text-blue-900/70 mb-6">
                Join us in celebrating culture and supporting our community. Partner with 
                Jalore Mahotsav and help make this festival even more spectacular.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4 text-center mb-6">
                <div>
                  <div className="text-2xl font-bold text-blue-600">1000+</div>
                  <div className="text-sm text-blue-900/70">Festival Attendees</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">50+</div>
                  <div className="text-sm text-blue-900/70">Cultural Performances</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">3</div>
                  <div className="text-sm text-blue-900/70">Days of Celebration</div>
                </div>
              </div>
              
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Contact Us for Sponsorship
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
