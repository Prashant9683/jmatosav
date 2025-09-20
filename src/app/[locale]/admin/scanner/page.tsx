// src/app/[locale]/admin/scanner/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { QrReader } from "react-qr-reader";
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
  const [isScanning, setIsScanning] = useState(false);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceIndex, setSelectedDeviceIndex] = useState<number>(0);
  const [facingMode, setFacingMode] = useState<"environment" | "user">(
    "environment"
  );
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasScanned, setHasScanned] = useState(false);
  const [scanData, setScanData] = useState<string | null>(null);

  // Discover available cameras (prompts permission if needed for labels)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (navigator?.mediaDevices?.getUserMedia) {
          // Requesting stream can help populate device labels on some browsers
          const tempStream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          tempStream.getTracks().forEach((track) => track.stop()); // Stop the temporary stream
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

  // Clean up camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  // Clean up camera stream when scanning stops
  useEffect(() => {
    if (!isScanning && stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [isScanning, stream]);

  const constraints: MediaTrackConstraints = useMemo(() => {
    if (videoDevices.length > 0 && videoDevices[selectedDeviceIndex]) {
      return {
        deviceId: { exact: videoDevices[selectedDeviceIndex].deviceId },
      };
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

  const startScanning = () => {
    setIsScanning(true);
    setResult(null);
    setHasScanned(false);
    setScanData(null);
  };

  const stopScanning = async () => {
    setIsScanning(false);

    // Force stop all camera tracks
    try {
      const mediaStreams = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      mediaStreams.getTracks().forEach((track) => track.stop());
    } catch {
      // Ignore errors if no active streams
    }

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleScan = async (data: string | null) => {
    if (
      data &&
      !isLoading &&
      session?.user?.id &&
      isScanning &&
      !hasScanned &&
      data !== scanData
    ) {
      console.log("Processing scan:", data);

      // Store the scanned data to prevent duplicate processing
      setScanData(data);
      setHasScanned(true);

      // Stop everything immediately
      setIsScanning(false);
      setIsLoading(true);
      setResult(null);

      // Force stop all camera tracks
      try {
        const mediaStreams = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        mediaStreams.getTracks().forEach((track) => track.stop());
      } catch {
        // Ignore errors if no active streams
      }

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }

      try {
        const response = await fetch("/api/checkin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            registrationId: data.trim(),
            adminUserId: session.user.id,
          }),
        });

        const result = await response.json();
        setResult(result as ScanResult);
      } catch (err) {
        console.error("Scanner API error:", err);
        setResult({ success: false, message: "An unexpected error occurred." });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">
            QR Code Ticket Scanner
          </h1>
          <p className="text-lg text-blue-900/70">
            Scan participant tickets for event check-in
          </p>
        </div>

        {/* Control Panel */}
        <div className="bg-white border border-black/10 rounded-lg p-6 mb-6 shadow-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex gap-3">
              {!isScanning ? (
                <button
                  type="button"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                  onClick={startScanning}
                >
                  <svg
                    className="w-5 h-5 mr-2"
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
                  Start Camera Scanner
                </button>
              ) : (
                <button
                  type="button"
                  className="inline-flex items-center px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                  onClick={stopScanning}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                    />
                  </svg>
                  Stop Scanner
                </button>
              )}

              {isScanning && (
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-3 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-all duration-200"
                  onClick={switchCamera}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Switch Camera
                </button>
              )}
            </div>

            {isScanning && (
              <div className="text-sm text-blue-900/70 font-medium bg-blue-50 px-3 py-2 rounded-lg">
                📹{" "}
                {videoDevices.length > 0
                  ? videoDevices[selectedDeviceIndex]?.label ||
                    `Camera ${selectedDeviceIndex + 1}`
                  : `Mode: ${facingMode}`}
              </div>
            )}
          </div>
        </div>

        {/* Scanner Area */}
        <div className="bg-white border border-black/10 rounded-lg overflow-hidden shadow-lg mb-6">
          {isScanning && !result && !hasScanned && (
            <div className="relative">
              <div
                className="bg-black rounded-lg overflow-hidden"
                style={{ height: "60vh" }}
              >
                <QrReader
                  key={`scanner-${isScanning}-${hasScanned}`}
                  onResult={
                    !hasScanned
                      ? (result) => {
                          if (!!result) {
                            handleScan(result.getText());
                          }
                        }
                      : undefined
                  }
                  constraints={constraints}
                  scanDelay={1000}
                  containerStyle={{ width: "100%", height: "100%" }}
                  videoStyle={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              {/* Scanning Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 border-2 border-blue-600/30 rounded-lg"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-blue-600 rounded-lg animate-pulse"></div>
              </div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg">
                <p className="text-sm font-medium">
                  Position QR code within the frame
                </p>
              </div>
            </div>
          )}

          {/* Instructions when not scanning */}
          {!isScanning && (
            <div className="p-12 text-center" style={{ height: "60vh" }}>
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="w-12 h-12 text-blue-600"
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
                </div>
                <h2 className="text-2xl font-bold text-black mb-4">
                  Ready to Scan Tickets
                </h2>
                <p className="text-blue-900/70 mb-4 max-w-md">
                  Click &quot;Start Camera Scanner&quot; to begin scanning QR
                  codes on participant tickets.
                </p>
                <p className="text-sm text-blue-900/50">
                  📱 Make sure to grant camera permissions when prompted
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Results Area */}
        <div className="bg-white border border-black/10 rounded-lg p-6 shadow-md">
          <div className="text-center">
            {isLoading && (
              <div className="space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-lg font-medium text-blue-900">
                  Verifying ticket...
                </p>
              </div>
            )}

            {result && (
              <div
                className={`p-6 rounded-lg ${
                  result.success
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    result.success ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {result.success ? (
                    <svg
                      className="w-8 h-8 text-green-500"
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
                  ) : (
                    <svg
                      className="w-8 h-8 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </div>

                <h3
                  className={`text-2xl font-bold mb-4 ${
                    result.success ? "text-green-900" : "text-red-900"
                  }`}
                >
                  {result.message}
                </h3>

                {result.participant && (
                  <div
                    className={`space-y-2 mb-6 ${
                      result.success ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    <p className="text-lg">
                      <strong>Name:</strong>{" "}
                      {result.participant.profiles?.full_name}
                    </p>
                    <p className="text-lg">
                      <strong>Event:</strong>{" "}
                      {result.participant.events?.title_en}
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                  onClick={startScanning}
                >
                  <svg
                    className="w-5 h-5 mr-2"
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
                  Scan Another Ticket
                </button>
              </div>
            )}

            {!isLoading && !result && !isScanning && (
              <div className="text-center py-8">
                <p className="text-blue-900/70 text-lg">
                  Ready to scan tickets. Click &quot;Start Camera Scanner&quot;
                  to begin.
                </p>
              </div>
            )}

            {!isLoading && !result && isScanning && (
              <div className="text-center py-8">
                <p className="text-blue-900/70 text-lg">
                  📱 Point the camera at a QR code to scan
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
