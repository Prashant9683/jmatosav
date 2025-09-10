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

  const getResultColor = () => {
    if (!result) return "text-white";
    return result.success
      ? "bg-green-500 border-green-400"
      : "bg-red-500 border-red-400";
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">Ticket Scanner</h1>

      {/* Control buttons */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {!isScanning ? (
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium"
              onClick={startScanning}
            >
              Scan Ticket
            </button>
          ) : (
            <button
              type="button"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium"
              onClick={stopScanning}
            >
              Stop Scanning
            </button>
          )}

          {isScanning && (
            <button
              type="button"
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
              onClick={switchCamera}
            >
              Switch Camera
            </button>
          )}
        </div>

        {isScanning && (
          <div className="text-sm text-gray-400">
            {videoDevices.length > 0
              ? videoDevices[selectedDeviceIndex]?.label ||
                `Camera ${selectedDeviceIndex + 1}`
              : `Facing: ${facingMode}`}
          </div>
        )}
      </div>

      {/* Scanner area */}
      {isScanning && !result && !hasScanned && (
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg h-[60vh]">
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
            containerStyle={{ width: "100%" }}
            videoStyle={{ width: "100%", height: "auto", objectFit: "cover" }}
          />
        </div>
      )}

      {/* Instructions when not scanning */}
      {!isScanning && (
        <div className="bg-gray-100 rounded-lg p-8 text-center h-[60vh] flex items-center justify-center">
          <div>
            <div className="text-6xl mb-4">📱</div>
            <h2 className="text-xl font-semibold mb-2">Ready to Scan</h2>
            <p className="text-gray-600 mb-4">
              Click &quot;Scan Ticket&quot; to start the camera and begin
              scanning QR codes.
            </p>
            <p className="text-sm text-gray-500">
              Make sure to grant camera permissions when prompted.
            </p>
          </div>
        </div>
      )}

      {/* Results area */}
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
            <button
              type="button"
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              onClick={startScanning}
            >
              Scan Another Ticket
            </button>
          </div>
        )}
        {!isLoading && !result && !isScanning && (
          <p>Click &quot;Scan Ticket&quot; to begin scanning QR codes.</p>
        )}
        {!isLoading && !result && isScanning && (
          <p>Point the camera at a QR code to scan.</p>
        )}
      </div>
    </div>
  );
}
