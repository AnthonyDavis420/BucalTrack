"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  email: string;
  role: string;
  isAuthenticated: boolean;
}

export default function CoachDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.isAuthenticated && parsedUser.role === "coach") {
        setUser(parsedUser);
      } else {
        router.push("/");
      }
    } else {
      router.push("/");
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-[#053D5E]">
              Coach Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-[#1e3a5f] text-white px-4 py-2 rounded-lg hover:bg-[#2a4a6b] transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Athlete Management Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Athlete Management
                </h3>
                <p className="text-sm text-gray-500">
                  Manage your athletes and their progress
                </p>
              </div>
            </div>
            <div className="mt-4">
              <button className="w-full bg-[#1e3a5f] text-white py-2 px-4 rounded-lg hover:bg-[#2a4a6b] transition-colors">
                Manage Athletes
              </button>
            </div>
          </div>

          {/* Training Programs Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Training Programs
                </h3>
                <p className="text-sm text-gray-500">
                  Create and manage training schedules
                </p>
              </div>
            </div>
            <div className="mt-4">
              <button className="w-full bg-[#1e3a5f] text-white py-2 px-4 rounded-lg hover:bg-[#2a4a6b] transition-colors">
                Training Programs
              </button>
            </div>
          </div>

          {/* Performance Tracking Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Performance Tracking
                </h3>
                <p className="text-sm text-gray-500">
                  Track athlete performance and progress
                </p>
              </div>
            </div>
            <div className="mt-4">
              <button className="w-full bg-[#1e3a5f] text-white py-2 px-4 rounded-lg hover:bg-[#2a4a6b] transition-colors">
                View Performance
              </button>
            </div>
          </div>
        </div>

        {/* My Athletes */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            My Athletes
          </h2>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        JD
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">John Doe</h3>
                      <p className="text-sm text-gray-500">
                        Basketball • Senior
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between text-sm">
                    <span className="text-gray-600">Last Training:</span>
                    <span className="text-gray-900">Yesterday</span>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-green-600">
                        MS
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Maria Santos
                      </h3>
                      <p className="text-sm text-gray-500">Swimming • Junior</p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between text-sm">
                    <span className="text-gray-600">Last Training:</span>
                    <span className="text-gray-900">2 days ago</span>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-purple-600">
                        AL
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Alex Lopez</h3>
                      <p className="text-sm text-gray-500">
                        Track & Field • Senior
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between text-sm">
                    <span className="text-gray-600">Last Training:</span>
                    <span className="text-gray-900">Today</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Training Sessions */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Upcoming Training Sessions
          </h2>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Basketball Practice
                    </h3>
                    <p className="text-sm text-gray-500">
                      Tomorrow, 3:00 PM - 5:00 PM
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      Scheduled
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Swimming Training
                    </h3>
                    <p className="text-sm text-gray-500">
                      Friday, 6:00 AM - 8:00 AM
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      Scheduled
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Track & Field Session
                    </h3>
                    <p className="text-sm text-gray-500">
                      Saturday, 7:00 AM - 9:00 AM
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Confirmed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coach Statistics */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Coaching Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-[#053D5E]">15</div>
              <div className="text-sm text-gray-600">Total Athletes</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-[#053D5E]">3</div>
              <div className="text-sm text-gray-600">Sports Disciplines</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-[#053D5E]">12</div>
              <div className="text-sm text-gray-600">
                Training Sessions/Week
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-[#053D5E]">5</div>
              <div className="text-sm text-gray-600">Upcoming Events</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
