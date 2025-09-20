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

  return <EventForm initialData={event} locale={locale} />;
}
