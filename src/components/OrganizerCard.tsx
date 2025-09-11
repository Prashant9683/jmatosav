import Image from "next/image";

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
    <div className="bg-gray-800 p-6 rounded-lg text-center">
      <Image
        src={imageUrl}
        alt={name}
        width={128}
        height={128}
        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
      />
      <h3 className="text-xl font-bold text-white">{name}</h3>
      <p className="text-blue-400">{title}</p>
    </div>
  );
}
