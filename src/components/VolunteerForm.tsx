"use client";

import { useState } from "react";
import { submitVolunteerApplication } from "@/app/actions";

export default function VolunteerForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

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
    }
  };

  const inputClass = "w-full p-2 bg-gray-700 border border-gray-600 rounded-md";
  const labelClass = "block text-sm font-medium text-gray-300 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="fullName" className={labelClass}>
          Full Name
        </label>
        <input
          type="text"
          name="fullName"
          id="fullName"
          className={inputClass}
          required
        />
      </div>
      <div>
        <label htmlFor="email" className={labelClass}>
          Email Address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          className={inputClass}
          required
        />
      </div>
      <div>
        <label htmlFor="phoneNumber" className={labelClass}>
          Phone Number (Optional)
        </label>
        <input
          type="tel"
          name="phoneNumber"
          id="phoneNumber"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="reason" className={labelClass}>
          Why do you want to volunteer?
        </label>
        <textarea
          name="reason"
          id="reason"
          className={`${inputClass} h-24`}
          required
        ></textarea>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg"
      >
        Submit Application
      </button>
      {message && (
        <p
          className={`mt-4 text-center p-2 rounded-md ${
            isSuccess
              ? "bg-green-800 text-green-200"
              : "bg-red-800 text-red-200"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
