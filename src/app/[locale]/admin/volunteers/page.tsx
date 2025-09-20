// src/app/[locale]/admin/volunteers/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase-client";
import VolunteerActions from "@/components/admin/VolunteerActions";
import { TableSkeleton } from "@/components/ui/skeleton";
import type { Database } from "@/types/supabase";

type Volunteer = Database["public"]["Tables"]["volunteers"]["Row"];

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("volunteers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching volunteers:", error);
        setError("Failed to load volunteers");
      } else {
        setVolunteers(data);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const totalVolunteers = volunteers?.length || 0;
  const approvedVolunteers =
    volunteers?.filter((v) => v.status === "approved").length || 0;
  const pendingVolunteers =
    volunteers?.filter((v) => v.status === "pending").length || 0;
  const rejectedVolunteers =
    volunteers?.filter((v) => v.status === "rejected").length || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-black mb-2">
              Volunteers Management
            </h1>
            <p className="text-lg text-blue-900/70">
              Manage volunteer applications and assignments
            </p>
          </div>
          <TableSkeleton rows={5} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-black mb-2">
              Volunteers Management
            </h1>
            <p className="text-lg text-blue-900/70">
              Manage volunteer applications and assignments
            </p>
          </div>
          <Card className="bg-white border border-red-200 shadow-md p-8 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchVolunteers}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </Card>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">
            Volunteers Management
          </h1>
          <p className="text-lg text-blue-900/70">
            Manage volunteer applications and assignments
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border border-black/10 p-6 shadow-md">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-black">
                  {totalVolunteers}
                </div>
                <div className="text-blue-900/70">Total Applications</div>
              </div>
            </div>
          </Card>

          <Card className="bg-white border border-black/10 p-6 shadow-md">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-green-600"
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
              </div>
              <div>
                <div className="text-2xl font-bold text-black">
                  {approvedVolunteers}
                </div>
                <div className="text-blue-900/70">Approved</div>
              </div>
            </div>
          </Card>

          <Card className="bg-white border border-black/10 p-6 shadow-md">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-yellow-600"
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
              <div>
                <div className="text-2xl font-bold text-black">
                  {pendingVolunteers}
                </div>
                <div className="text-blue-900/70">Pending Review</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="bg-white border border-black/10 shadow-md">
          <div className="p-6 border-b border-black/10">
            <h2 className="text-2xl font-semibold text-black flex items-center">
              <span className="w-2 h-6 bg-blue-600 mr-3 rounded"></span>
              Volunteer Applications
            </h2>
          </div>

          {volunteers && volunteers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-50/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                      Applied
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10">
                  {volunteers.map((volunteer) => (
                    <tr key={volunteer.id} className="hover:bg-blue-50/30">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-black">
                          {volunteer.full_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-blue-900/70">
                          {volunteer.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-blue-900/70">
                          {volunteer.phone_number || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            volunteer.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : volunteer.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {volunteer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900/70">
                        {volunteer.created_at
                          ? new Date(volunteer.created_at).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <VolunteerActions
                          volunteer={volunteer}
                          onRefresh={fetchVolunteers}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">
                No Applications Yet
              </h3>
              <p className="text-blue-900/70 mb-6 max-w-lg mx-auto">
                There are no volunteer applications to review at this time.
                Applications will appear here as people submit them through the
                volunteer page.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
