import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import type { Database } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-black mb-2">
                Admin Dashboard
              </h1>
              <p className="text-lg text-blue-900/70">
                Manage events and festival operations
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <Link href={`/${locale}/admin/events/new`}>
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Create New Event
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Link href={`/${locale}/admin/volunteers`}>
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Manage Volunteers
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Link href={`/${locale}/admin/scanner`}>
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
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1zm12 0h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1a1 1 0 001 1zM5 20h2a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z"
                    />
                  </svg>
                  Ticket Scanner
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Events Table */}
        <Card className="bg-white border border-black/10 shadow-md">
          <div className="p-6 border-b border-black/10">
            <h2 className="text-2xl font-semibold text-black flex items-center">
              <span className="w-2 h-6 bg-blue-600 mr-3 rounded"></span>
              Festival Events
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50/50">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-black">
                    Event Title
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-black">
                    Date
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-black">
                    Status
                  </th>
                  <th className="p-4 text-center text-sm font-semibold text-black">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {events && events.length > 0 ? (
                  events.map((event) => (
                    <tr
                      key={event.id}
                      className="border-t border-black/10 hover:bg-blue-50/30 transition-colors"
                    >
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-black">
                            {event.title_en}
                          </div>
                          {event.title_hi && (
                            <div className="text-sm text-blue-900/70">
                              {event.title_hi}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-blue-900/70">
                        {new Date(event.event_date).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-900">
                          Active
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="border-blue-600 text-blue-600 hover:bg-blue-50"
                          >
                            <Link
                              href={`/${locale}/admin/events/${event.id}/registrations`}
                            >
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
                                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                              Registrations
                            </Link>
                          </Button>

                          <Button
                            asChild
                            size="sm"
                            className="bg-blue-600 text-white hover:bg-blue-700"
                          >
                            <Link
                              href={`/${locale}/admin/events/${event.id}/edit`}
                            >
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
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Edit
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-12 text-center">
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
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-black mb-2">
                          No Events Yet
                        </h3>
                        <p className="text-blue-900/70 mb-4">
                          Create your first festival event to get started.
                        </p>
                        <Button
                          asChild
                          className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                          <Link href={`/${locale}/admin/events/new`}>
                            Create First Event
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
