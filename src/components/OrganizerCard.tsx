import Image from "next/image";
import { Card } from "@/components/ui/card";

interface OrganizerCardProps {
  name: string;
  title: string;
  imageUrl: string;
}

export default function OrganizerCard({
  name,
  title,
  imageUrl,
}: OrganizerCardProps) {
  return (
    <Card className="p-6 text-center bg-white border border-black/10 shadow-md hover:shadow-lg transition-shadow duration-200">
      <Image
        src={imageUrl}
        alt={name}
        width={128}
        height={128}
        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-2 border-blue-200"
      />
      <h3 className="text-xl font-bold text-black">{name}</h3>
      <p className="text-blue-600 font-medium">{title}</p>
    </Card>
  );
}
