import EventForm from "@/components/admin/EventForm";

interface NewEventPageProps {
  params: Promise<{ locale: string }>;
}

export default async function NewEventPage({ params }: NewEventPageProps) {
  const { locale } = await params;

  return <EventForm locale={locale} />;
}
