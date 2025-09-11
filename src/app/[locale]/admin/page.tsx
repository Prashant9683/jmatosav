import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import type { Database } from "@/types/supabase";

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
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Events</h1>
        <Link
          href={`/${locale}/admin/events/new`}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          + Create New Event
        </Link>
        <Link
          href={`/${locale}/admin/volunteers`}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Manage Volunteers
        </Link>
      </div>
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-4">Event Title (English)</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events?.map((event) => (
              <tr key={event.id} className="border-t border-gray-700">
                <td className="p-4">{event.title_en}</td>
                <td className="p-4">{event.event_date}</td>
                <td className="p-4 space-x-4 text-center">
                  <Link
                    href={`/${locale}/admin/events/${event.id}/registrations`}
                    className="text-green-400 hover:underline"
                  >
                    View Registrations
                  </Link>
                  <Link
                    href={`/${locale}/admin/events/${event.id}/edit`}
                    className="text-blue-400 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
