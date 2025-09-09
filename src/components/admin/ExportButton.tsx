"use client";

// Define a precise type for the data we expect from Supabase
type Profile = {
  full_name: string | null;
  email: string | null;
} | null; // The profile itself can be null

type RegistrationWithProfile = {
  id: number;
  profiles: Profile;
};

interface ExportButtonProps {
  registrations: RegistrationWithProfile[];
  eventName: string;
}

export default function ExportButton({
  registrations,
  eventName,
}: ExportButtonProps) {
  const handleExport = () => {
    const headers = "Name,Email\n";
    const rows = registrations
      .map((reg) => {
        // Safely handle potentially null profiles
        const name = `"${reg.profiles?.full_name || "N/A"}"`;
        const email = `"${reg.profiles?.email || "N/A"}"`;
        return `${name},${email}`;
      })
      .join("\n");

    const csvContent = headers + rows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    const safeEventName = eventName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    link.setAttribute("download", `${safeEventName}_registrations.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExport}
      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
    >
      Export as CSV
    </button>
  );
}
