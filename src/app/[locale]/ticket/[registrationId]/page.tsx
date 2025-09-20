"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import Image from "next/image";
// Removed unused Tables import
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase-client";

type RegistrationWithDetails = {
  id: number;
  checked_in_at: string | null;
  profiles: { id: string; full_name: string } | null;
  events: { title_en: string; title_hi: string; event_date: string } | null;
};

interface TicketPageProps {
  params: Promise<{ registrationId: string; locale: string }>;
}

export default function TicketPage({ params }: TicketPageProps) {
  const router = useRouter();
  const { session, loading } = useAuth();
  const [registration, setRegistration] =
    useState<RegistrationWithDetails | null>(null);
  const [locale, setLocale] = useState<string>("");
  const [registrationId, setRegistrationId] = useState<string>("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setLocale(resolvedParams.locale);
      setRegistrationId(resolvedParams.registrationId);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!loading && registrationId) {
      if (!session) {
        router.push(`/${locale}/login`);
        return;
      }

      const fetchTicketData = async () => {
        try {
          // Fetch registration data
          const { data: registrationData, error: regError } = await supabase
            .from("registrations")
            .select("id, checked_in_at, user_id, event_id")
            .eq("id", registrationId)
            .single();

          if (regError || !registrationData) {
            console.error("Error fetching registration:", regError);
            notFound();
            return;
          }

          // Fetch user profile data
          const { data: profileData } = await supabase
            .from("profiles")
            .select("id, full_name")
            .eq("id", registrationData.user_id)
            .single();

          // Fetch event data
          const { data: eventData } = await supabase
            .from("events")
            .select("title_en, title_hi, event_date")
            .eq("id", registrationData.event_id)
            .single();

          // Combine the data
          const combinedData: RegistrationWithDetails = {
            ...registrationData,
            profiles: profileData ?? null,
            events: eventData ?? null,
          };

          // Security Check: Ensure the logged-in user owns this ticket or is an admin
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single();

          const isOwner = combinedData.profiles?.id === session.user.id;
          const isAdmin = profile?.role === "admin";

          if (!isOwner && !isAdmin) {
            notFound();
            return;
          }

          setRegistration(combinedData);
          setIsAuthorized(true);

          // Generate QR code
          const qrDataUrl = await QRCode.toDataURL(combinedData.id.toString());
          setQrCodeDataUrl(qrDataUrl);
        } catch (error) {
          console.error("Error fetching ticket data:", error);
          notFound();
        } finally {
          setIsLoading(false);
        }
      };

      fetchTicketData();
    }
  }, [session, loading, registrationId, locale, router]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-900/70 font-medium">Loading your ticket...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect in useEffect
  }

  if (!registration || !isAuthorized) {
    notFound();
    return null;
  }

  const eventTitle =
    locale === "hi"
      ? registration.events?.title_hi
      : registration.events?.title_en;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">
            Your Festival Ticket
          </h1>
          <p className="text-lg text-blue-900/70">
            Present this QR code at the event entrance
          </p>
        </div>

        {/* Ticket Card */}
        <div className="flex justify-center">
          <div className="bg-white border border-black/10 rounded-2xl shadow-xl p-8 max-w-md w-full overflow-hidden relative">
            {/* Header Accent */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-blue-600"></div>

            {/* Festival Branding */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-black mb-2">
                {eventTitle}
              </h2>
              <p className="text-blue-900/70 font-medium">
                Jalore Mahotsav 2024
              </p>
            </div>

            {/* Event Details */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between py-2 border-b border-black/10">
                <span className="text-blue-900/70 font-medium">Date</span>
                <span className="text-black font-semibold">
                  {new Date(
                    registration.events?.event_date || ""
                  ).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-black/10">
                <span className="text-blue-900/70 font-medium">Attendee</span>
                <span className="text-black font-semibold">
                  {registration.profiles?.full_name}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-blue-900/70 font-medium">Ticket ID</span>
                <span className="text-black font-mono text-sm">
                  #{registration.id.toString().padStart(6, "0")}
                </span>
              </div>
            </div>

            {/* QR Code */}
            <div className="text-center mb-6">
              <div className="bg-white border-2 border-blue-200 rounded-lg p-4 inline-block">
                <Image
                  src={qrCodeDataUrl}
                  alt="Event Registration QR Code"
                  width={200}
                  height={200}
                  className="w-48 h-48"
                  unoptimized
                />
              </div>
              <p className="text-sm text-blue-900/70 mt-3">
                Scan at entrance for quick check-in
              </p>
            </div>

            {/* Check-in Status */}
            {registration.checked_in_at ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <svg
                  className="w-6 h-6 text-green-500 mx-auto mb-2"
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
                <p className="text-green-900 font-semibold">Checked In</p>
                <p className="text-green-700 text-sm">
                  {new Date(registration.checked_in_at).toLocaleString()}
                </p>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <svg
                  className="w-6 h-6 text-blue-600 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-blue-900 font-semibold">
                  Ready for Check-in
                </p>
                <p className="text-blue-700 text-sm">
                  Present this ticket at the venue
                </p>
              </div>
            )}

            {/* Decorative Elements */}
            <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-blue-600 rounded-full opacity-10"></div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full opacity-10"></div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 text-center max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-black mb-4">
            Important Instructions
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
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
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-black font-medium mb-1">Keep This Handy</p>
              <p className="text-blue-900/70 text-sm">
                Save or screenshot this ticket
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-black font-medium mb-1">Arrive Early</p>
              <p className="text-blue-900/70 text-sm">
                Check-in 30 minutes before
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
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
                    d="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-black font-medium mb-1">Valid ID Required</p>
              <p className="text-blue-900/70 text-sm">
                Bring photo identification
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
