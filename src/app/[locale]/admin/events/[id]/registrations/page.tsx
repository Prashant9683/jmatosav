import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Database } from "@/types/supabase";
import ExportButton from "@/components/admin/ExportButton";

// Local type for display/export
type Profile = { full_name: string | null; email: string | null } | null;
type RegistrationWithProfile = { id: number; profiles: Profile };

// Correctly typed props for a Next.js 15 Server Component with dynamic params
interface RegistrationsPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function RegistrationsPage({
  params,
}: RegistrationsPageProps) {
  // Correctly await the params as required by Next.js 15
  const { id: eventId, locale } = await params;

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch the event details to display the title
  const { data: event } = await supabase
    .from("events")
    .select("title_en, title_hi")
    .eq("id", parseInt(eventId))
    .single();

  if (!event) {
    notFound();
  }

  // Step 1: Fetch registrations with user_id
  const { data: regRows, error } = await supabase
    .from("registrations")
    .select("id, user_id")
    .eq("event_id", parseInt(eventId));

  if (error) {
    console.error("Error fetching registrations", error);
  }

  // Step 2: Fetch profiles for unique user_ids (if any)
  const userIds = Array.from(new Set((regRows || []).map((r) => r.user_id)));
  const profilesById = new Map<
    string,
    { full_name: string | null; email: string | null }
  >();
  if (userIds.length > 0) {
    type ProfileRow = { id: string; full_name: string | null; email: string | null };
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("id", userIds);
    if (profilesError) {
      console.error("Error fetching profiles", profilesError);
    } else {
      const rows = (profilesData ?? []) as ProfileRow[];
      for (const p of rows) {
        profilesById.set(p.id, {
          full_name: p.full_name ?? null,
          email: p.email ?? null,
        });
      }
    }
  }

  // Map to the shape expected by ExportButton using joined profiles
  const registrations: RegistrationWithProfile[] = (regRows || []).map((r) => ({
    id: r.id,
    profiles: profilesById.get(r.user_id) ?? null,
  }));

  const eventTitle = locale === "hi" ? event.title_hi : event.title_en;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <Link
        href={`/${locale}/admin`}
        className="text-blue-400 hover:underline mb-6 inline-block"
      >
        &larr; Back to Events
      </Link>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Registrations</h1>
          <p className="text-lg text-gray-400">{eventTitle}</p>
        </div>
        {registrations.length > 0 && (
          <ExportButton
            registrations={registrations}
            eventName={eventTitle || ""}
          />
        )}
      </div>
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-4">Full Name</th>
              <th className="p-4">Email</th>
            </tr>
          </thead>
          <tbody>
            {registrations.length > 0 ? (
              registrations.map((reg) => (
                <tr key={reg.id} className="border-t border-gray-700">
                  <td className="p-4">{reg.profiles?.full_name || "N/A"}</td>
                  <td className="p-4">{reg.profiles?.email || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="text-center p-8 text-gray-400">
                  No one has registered for this event yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
