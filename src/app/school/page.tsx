"use client";

import { useEffect, useState } from "react";

type Role = "admin" | "school";
interface User {
  email: string;
  role: Role;
  isAuthenticated: boolean;
}

export default function SchoolAnnouncementsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (!raw) {
        window.location.replace("/");
        return;
      }
      const parsed = JSON.parse(raw) as User;
      if (parsed?.isAuthenticated && parsed?.role === "school") {
        setUser(parsed);
      } else {
        window.location.replace("/");
        return;
      }
    } catch {
      window.location.replace("/");
      return;
    } finally {
      setReady(true);
    }
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="flex gap-8">
      {/* Left Column - Announcements */}
      <section className="flex-1">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Announcements</h1>
          <p className="text-sm text-gray-500">Stay updated with the latest BUCAL announcements</p>
        </header>

        {/* Announcement Cards */}
        <div className="space-y-4">
          {/* Card 1 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 text-sm font-medium">BA</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">BUCAL Admin</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Basketball Tournament 2024 - Registration Open
            </h3>
            <p className="text-gray-600 text-sm">
              We are excited to announce that registration for the Basketball
              Tournament 2024 is now open! Schools can register their teams
              starting today. Please ensure all player documents are complete
              before submitting your registration.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 text-sm font-medium">BA</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">BUCAL Admin</p>
                  <p className="text-xs text-gray-500">5 days ago</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              New Player Screening Requirements
            </h3>
            <p className="text-gray-600 text-sm">
              Effective immediately, all players must complete the new health
              screening process. This includes updated medical certificates and
              fitness assessments. Please coordinate with your school's medical
              team to ensure compliance.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-purple-600 text-sm font-medium">BA</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">BUCAL Admin</p>
                  <p className="text-xs text-gray-500">1 week ago</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Swimming Competition Venue Change
            </h3>
            <p className="text-gray-600 text-sm">
              Due to maintenance work at the original venue, the Swimming
              Competition 2024 will now be held at the Cebu City Sports Complex.
              All registered schools will receive updated venue information and
              logistics details via email.
            </p>
          </div>
        </div>
      </section>

      {/* Right Column - Pinned */}
      <aside className="w-80">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pinned Announcements</h2>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                <span className="text-blue-600 text-xs font-medium">BA</span>
              </div>
              <span className="text-xs text-gray-500">BUCAL Admin - Pinned</span>
            </div>
            <button className="text-blue-600 hover:text-blue-700">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Basketball Tournament 2024 - Registration Open
          </h4>
          <p className="text-xs text-gray-600">
            We are excited to announce that registration for the Basketball
            Tournament 2024 is now open! Schools can register their teams
            starting today.
          </p>
        </div>
      </aside>
    </div>
  );
}