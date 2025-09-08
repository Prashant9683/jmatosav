import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import EventForm from "@/components/admin/EventForm";
import type { Database } from "@/types/supabase";

interface EditEventPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id, locale } = await params;

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", parseInt(id))
    .single();

  if (!event) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Event: {event.title_en}</h1>
      <EventForm initialData={event} locale={locale} />
    </div>
  );
}
