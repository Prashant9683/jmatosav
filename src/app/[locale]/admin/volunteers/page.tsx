// src/app/[locale]/admin/volunteers/page.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VolunteersPage() {
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
                <div className="text-2xl font-bold text-black">24</div>
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
                <div className="text-2xl font-bold text-black">18</div>
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
                <div className="text-2xl font-bold text-black">6</div>
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
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">
              Coming Soon
            </h3>
            <p className="text-blue-900/70 mb-6 max-w-lg mx-auto">
              The volunteer management system is currently under development.
              This will include application review, volunteer assignment, and
              communication tools.
            </p>

            <div className="space-y-4">
              <h4 className="text-lg font-medium text-black">
                Planned Features:
              </h4>
              <div className="grid md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-blue-600 mr-2 mt-0.5"
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
                  <span className="text-blue-900/70">
                    Review volunteer applications
                  </span>
                </div>
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-blue-600 mr-2 mt-0.5"
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
                  <span className="text-blue-900/70">
                    Assign volunteers to events
                  </span>
                </div>
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-blue-600 mr-2 mt-0.5"
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
                  <span className="text-blue-900/70">
                    Send notifications and updates
                  </span>
                </div>
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-blue-600 mr-2 mt-0.5"
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
                  <span className="text-blue-900/70">
                    Track volunteer hours
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button
                disabled
                className="bg-blue-600/50 text-white cursor-not-allowed"
              >
                Feature In Development
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
