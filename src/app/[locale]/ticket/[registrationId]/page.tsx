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
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
        <div className="text-white">Loading...</div>
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
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-sm w-full">
        <h1 className="text-2xl font-bold text-white mb-2">{eventTitle}</h1>
        <p className="text-gray-400 mb-4">{registration.events?.event_date}</p>
        <p className="text-xl text-white font-medium mb-6">
          Presented by: {registration.profiles?.full_name}
        </p>

        <div className="bg-white p-4 rounded-md">
          <Image
            src={qrCodeDataUrl}
            alt="Event Registration QR Code"
            width={512}
            height={512}
            className="w-full h-auto"
            unoptimized
          />
        </div>

        {registration.checked_in_at && (
          <p className="mt-6 text-lg font-bold text-green-500">
            Checked In: {new Date(registration.checked_in_at).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
