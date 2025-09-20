import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Database } from "@/types/supabase";
import ExportButton from "@/components/admin/ExportButton";

// Local type for display/export
type Profile = { full_name: string | null; email: string | null } | null;
type RegistrationWithProfile = {
  id: number;
  checked_in_at: string | null;
  profiles: Profile;
};

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

  // Step 1: Fetch registrations with user_id and checked_in_at
  const { data: regRows, error } = await supabase
    .from("registrations")
    .select("id, user_id, checked_in_at")
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
    type ProfileRow = {
      id: string;
      full_name: string | null;
      email: string | null;
    };
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
    checked_in_at: r.checked_in_at,
    profiles: profilesById.get(r.user_id) ?? null,
  }));

  const eventTitle = locale === "hi" ? event.title_hi : event.title_en;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Navigation */}
        <Link
          href={`/${locale}/admin`}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-6"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Admin Dashboard
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-black mb-2">
              Event Registrations
            </h1>
            <p className="text-lg text-blue-900/70">{eventTitle}</p>
          </div>
          {registrations.length > 0 && (
            <ExportButton
              registrations={registrations}
              eventName={eventTitle || ""}
            />
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-black/10 rounded-lg p-6 shadow-md">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-black">
                  {registrations.length}
                </div>
                <div className="text-blue-900/70">Total Registrations</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-black/10 rounded-lg p-6 shadow-md">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-black">
                  {registrations.filter((r) => r.profiles?.full_name).length}
                </div>
                <div className="text-blue-900/70">Complete Profiles</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-black/10 rounded-lg p-6 shadow-md">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-black">
                  {registrations.filter((r) => !r.profiles?.full_name).length}
                </div>
                <div className="text-blue-900/70">Incomplete Profiles</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-black/10 rounded-lg p-6 shadow-md">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-black">
                  {registrations.filter((r) => r.checked_in_at).length}
                </div>
                <div className="text-blue-900/70">Attended</div>
              </div>
            </div>
          </div>
        </div>

        {/* Registrations Table */}
        <div className="bg-white border border-black/10 rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-black/10">
            <h2 className="text-2xl font-semibold text-black flex items-center">
              <span className="w-2 h-6 bg-blue-600 mr-3 rounded"></span>
              Registered Participants
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50/50">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-black">
                    Full Name
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-black">
                    Email Address
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-black">
                    Registration Date
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-black">
                    Attendance Status
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-black">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {registrations.length > 0 ? (
                  registrations.map((reg) => (
                    <tr
                      key={reg.id}
                      className="border-t border-black/10 hover:bg-blue-50/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-medium text-black">
                          {reg.profiles?.full_name || "N/A"}
                        </div>
                      </td>
                      <td className="p-4 text-blue-900/70">
                        {reg.profiles?.email || "N/A"}
                      </td>
                      <td className="p-4 text-blue-900/70">
                        {new Date().toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        {reg.checked_in_at ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-900">
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Attended at{" "}
                            {new Date(reg.checked_in_at).toLocaleTimeString()}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-900">
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Not Checked In
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            reg.profiles?.full_name
                              ? "bg-green-100 text-green-900"
                              : "bg-yellow-100 text-yellow-900"
                          }`}
                        >
                          {reg.profiles?.full_name ? "Complete" : "Incomplete"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                          <svg
                            className="w-8 h-8 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-black mb-2">
                          No Registrations Yet
                        </h3>
                        <p className="text-blue-900/70">
                          No one has registered for this event yet.
                          Registrations will appear here once people sign up.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
