"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase-client";
import type { Database } from "@/types/supabase";

type Volunteer = Database["public"]["Tables"]["volunteers"]["Row"];

interface VolunteerActionsProps {
  volunteer: Volunteer;
  onRefresh?: () => void;
}

export default function VolunteerActions({
  volunteer,
  onRefresh,
}: VolunteerActionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      // Get the access token from the current session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        alert("Please log in again.");
        return;
      }

      const response = await fetch("/api/volunteers/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ volunteerId: volunteer.id }),
      });

      const result = await response.json();

      if (!result.success) {
        alert(result.message);
      } else {
        onRefresh?.();
      }
    } catch (error) {
      console.error("Error approving volunteer:", error);
      alert("Failed to approve volunteer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      // Get the access token from the current session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        alert("Please log in again.");
        return;
      }

      const response = await fetch("/api/volunteers/reject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ volunteerId: volunteer.id }),
      });

      const result = await response.json();

      if (!result.success) {
        alert(result.message);
      } else {
        onRefresh?.();
      }
    } catch (error) {
      console.error("Error rejecting volunteer:", error);
      alert("Failed to reject volunteer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (volunteer.status === "approved") {
    return <span className="text-green-600 font-semibold">Approved</span>;
  }

  if (volunteer.status === "rejected") {
    return <span className="text-red-600 font-semibold">Rejected</span>;
  }

  // Status is pending
  return (
    <div className="flex gap-2">
      <Button
        onClick={handleApprove}
        disabled={isLoading}
        size="sm"
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        {isLoading ? "Updating..." : "Approve"}
      </Button>
      <Button
        onClick={handleReject}
        disabled={isLoading}
        size="sm"
        variant="outline"
        className="border-red-600 text-red-600 hover:bg-red-50"
      >
        {isLoading ? "Updating..." : "Reject"}
      </Button>
    </div>
  );
}
