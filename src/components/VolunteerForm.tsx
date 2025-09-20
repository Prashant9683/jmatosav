"use client";

import { useState } from "react";
import { submitVolunteerApplication } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VolunteerForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError(
        "Phone number must be exactly 10 digits starting with 6, 7, 8, or 9"
      );
      return false;
    }
    setPhoneError(null);
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setPhoneError(null);

    const formData = new FormData(event.currentTarget);
    const phoneNumber = formData.get("phoneNumber") as string;

    // Validate phone number
    if (!validatePhone(phoneNumber)) {
      setIsLoading(false);
      return;
    }

    // Try API route first (primary method)
    try {
      const response = await fetch("/api/volunteer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.get("fullName"),
          email: formData.get("email"),
          phoneNumber: formData.get("phoneNumber"),
          reason: formData.get("reason"),
        }),
      });

      const result = await response.json();
      setMessage(result.message);
      setIsSuccess(result.success);
      if (result.success) {
        (event.target as HTMLFormElement).reset();
      }
    } catch (error) {
      console.error("API route failed, trying server action:", error);

      // Fallback to server action
      const response = await submitVolunteerApplication(formData);
      setMessage(response.message);
      setIsSuccess(response.success);
      if (response.success) {
        (event.target as HTMLFormElement).reset();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white border border-black/10 shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-black">
          Become a Volunteer
        </CardTitle>
        <p className="text-blue-900/70">
          Join us in making Jalore Mahotsav a memorable celebration
        </p>
      </CardHeader>

      <CardContent>
        {message && (
          <Alert variant={isSuccess ? "success" : "error"} className="mb-6">
            {message}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-black font-medium">
              Full Name
            </Label>
            <Input
              type="text"
              name="fullName"
              id="fullName"
              className="bg-white border-black/20 text-black placeholder:text-blue-900/50"
              placeholder="Enter your full name"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-black font-medium">
              Email Address
            </Label>
            <Input
              type="email"
              name="email"
              id="email"
              className="bg-white border-black/20 text-black placeholder:text-blue-900/50"
              placeholder="Enter your email address"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-black font-medium">
              Phone Number
            </Label>
            <Input
              type="tel"
              name="phoneNumber"
              id="phoneNumber"
              className={`bg-white border-black/20 text-black placeholder:text-blue-900/50 ${
                phoneError ? "border-red-500" : ""
              }`}
              placeholder="Enter 10-digit mobile number (e.g., 9876543210)"
              pattern="[6-9][0-9]{9}"
              minLength={10}
              maxLength={10}
              required
              disabled={isLoading}
              onChange={(e) => {
                if (e.target.value.length === 10) {
                  validatePhone(e.target.value);
                } else {
                  setPhoneError(null);
                }
              }}
            />
            {phoneError ? (
              <p className="text-xs text-red-600">{phoneError}</p>
            ) : (
              <p className="text-xs text-blue-900/60">
                Enter your 10-digit mobile number starting with 6, 7, 8, or 9
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="text-black font-medium">
              Why do you want to volunteer?
            </Label>
            <textarea
              name="reason"
              id="reason"
              className="w-full h-24 px-3 py-2 rounded-md border border-black/20 bg-white text-black placeholder:text-blue-900/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:border-blue-600 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
              placeholder="Tell us what motivates you to volunteer for this festival..."
              required
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700 font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isLoading ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
