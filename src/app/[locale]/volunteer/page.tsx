import VolunteerForm from "@/components/VolunteerForm";

export default function VolunteerPage() {
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-4xl font-bold text-center mb-4">
        Become a Volunteer
      </h1>
      <p className="text-center text-gray-400 mb-8">
        Be a part of the team that makes Jalore Mahotsav happen! Fill out the
        form below to apply.
      </p>
      <VolunteerForm />
    </div>
  );
}
