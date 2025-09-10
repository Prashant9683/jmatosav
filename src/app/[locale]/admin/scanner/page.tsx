// src/app/[locale]/admin/scanner/page.tsx - NEW FILE
"use client";

import { useEffect, useMemo, useState } from "react";
import { QrReader } from "react-qr-reader";
import { checkInTicket } from "@/app/actions"; // Import our server action
import { useAuth } from "@/components/AuthProvider";

// Define a type for our scan result state
type ScanResult = {
  success: boolean;
  message: string;
  participant?: {
    profiles: { full_name: string | null } | null;
    events: { title_en: string | null } | null;
  };
} | null;

export default function ScannerPage() {
  const { session } = useAuth();
  const [result, setResult] = useState<ScanResult>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceIndex, setSelectedDeviceIndex] = useState<number>(0);
  const [facingMode, setFacingMode] = useState<"environment" | "user">(
    "environment"
  );

  // Discover available cameras (prompts permission if needed for labels)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (navigator?.mediaDevices?.getUserMedia) {
          // Requesting stream can help populate device labels on some browsers
          await navigator.mediaDevices.getUserMedia({ video: true });
        }
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videos = devices.filter((d) => d.kind === "videoinput");
        if (mounted) setVideoDevices(videos);
      } catch (e) {
        // If permissions denied, we still fall back to facingMode control
        console.error("Camera access error:", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const constraints: MediaTrackConstraints = useMemo(() => {
    if (videoDevices.length > 0 && videoDevices[selectedDeviceIndex]) {
      return { deviceId: { exact: videoDevices[selectedDeviceIndex].deviceId } };
    }
    return { facingMode };
  }, [videoDevices, selectedDeviceIndex, facingMode]);

  const switchCamera = () => {
    if (videoDevices.length > 1) {
      setSelectedDeviceIndex((i) => (i + 1) % videoDevices.length);
    } else {
      setFacingMode((m) => (m === "environment" ? "user" : "environment"));
    }
  };

  const handleScan = async (data: string | null) => {
    if (data && !isLoading && session?.user?.id) {
      setIsLoading(true);
      setResult(null); // Clear previous result
      try {
        const response = await checkInTicket(data.trim(), session.user.id);
        setResult(response as ScanResult);
      } catch (err) {
        console.error("Scanner action error:", err);
        setResult({ success: false, message: "An unexpected error occurred." });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getResultColor = () => {
    if (!result) return "text-white";
    return result.success
      ? "bg-green-500 border-green-400"
      : "bg-red-500 border-red-400";
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">Ticket Scanner</h1>
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
          onClick={switchCamera}
        >
          Switch camera
        </button>
        <div className="text-sm text-gray-400">
          {videoDevices.length > 0
            ? videoDevices[selectedDeviceIndex]?.label || `Camera ${selectedDeviceIndex + 1}`
            : `Facing: ${facingMode}`}
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg h-[60vh]">
        <QrReader
          onResult={(result) => {
            if (!!result) {
              handleScan(result.getText());
            }
          }}
          constraints={constraints}
          scanDelay={400}
          containerStyle={{ width: "100%" }}
          videoStyle={{ width: "100%", height: "auto", objectFit: "cover" }}
        />
      </div>
      <div
        className={`mt-4 p-4 rounded-lg border text-center ${getResultColor()}`}
      >
        {isLoading && <p>Verifying...</p>}
        {result && (
          <div>
            <p className="text-2xl font-bold">{result.message}</p>
            {result.participant && (
              <div className="mt-2 text-lg">
                <p>Name: {result.participant.profiles?.full_name}</p>
                <p>Event: {result.participant.events?.title_en}</p>
              </div>
            )}
          </div>
        )}
        {!isLoading && !result && (
          <p>Scan a QR code to see validation status.</p>
        )}
      </div>
    </div>
  );
}
