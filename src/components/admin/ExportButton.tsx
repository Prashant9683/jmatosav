"use client";

import { Button } from "@/components/ui/button";

// Define a precise type for the data we expect from Supabase
type Profile = {
  full_name: string | null;
  email: string | null;
} | null; // The profile itself can be null

type RegistrationWithProfile = {
  id: number;
  checked_in_at: string | null;
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
    const headers = "Name,Email,CheckedInTime\n";
    const rows = registrations
      .map((reg) => {
        // Safely handle potentially null profiles
        const name = `"${reg.profiles?.full_name || "N/A"}"`;
        const email = `"${reg.profiles?.email || "N/A"}"`;
        const checkedInTime = reg.checked_in_at
          ? `"${new Date(reg.checked_in_at).toLocaleString()}"`
          : '"N/A"';
        return `${name},${email},${checkedInTime}`;
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
    <Button
      onClick={handleExport}
      variant="outline"
      className="bg-white text-blue-600 border-blue-600 hover:bg-blue-50 hover:border-blue-700 font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
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
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      Export as CSV
    </Button>
  );
}
