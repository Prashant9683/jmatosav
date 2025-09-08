import EventForm from "@/components/admin/EventForm";

interface NewEventPageProps {
  params: Promise<{ locale: string }>;
}

export default async function NewEventPage({ params }: NewEventPageProps) {
  const { locale } = await params;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Create New Event</h1>
      <EventForm locale={locale} />
    </div>
  );
}
