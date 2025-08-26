'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Users, Clock, Plus } from 'lucide-react';

interface User {
  email: string;
  role: string;
  isAuthenticated: boolean;
}

export default function SchoolEventsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.isAuthenticated && parsedUser.role === 'school') {
        setUser(parsedUser);
      } else {
        router.push('/');
      }
    } else {
      router.push('/');
    }
    setIsLoading(false);
  }, [router]);

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
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="h-6 w-6 text-blue-600" />
          Events
        </h1>
        <p className="text-gray-600 mt-1">Manage your school's event registrations</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('available')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'available'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Available Events
            </button>
            <button
              onClick={() => setActiveTab('registered')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'registered'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Registered Events
            </button>
          </nav>
        </div>
      </div>

      {/* Available Events Tab */}
      {activeTab === 'available' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow border p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Basketball Tournament 2024</h3>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Open
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Annual inter-school basketball competition featuring boys and girls divisions. 
                  Teams will compete in a round-robin format followed by elimination rounds.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>March 20-25, 2024</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>Cebu Coliseum</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>Max 2 teams per school</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Deadline: March 15</span>
                  </div>
                </div>
              </div>
              <div className="ml-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Register
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Swimming Competition 2024</h3>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Open
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Swimming championship with individual and relay events across multiple age categories. 
                  Includes freestyle, backstroke, breaststroke, and butterfly competitions.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>April 5-7, 2024</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>Cebu City Sports Complex</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>Max 20 athletes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Deadline: March 30</span>
                  </div>
                </div>
              </div>
              <div className="ml-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Register
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Volleyball Championship 2024</h3>
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                    Coming Soon
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Inter-school volleyball tournament featuring both indoor and beach volleyball competitions. 
                  Separate divisions for boys and girls teams.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>May 10-15, 2024</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>Various Venues</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>Max 2 teams per school</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Opens: April 1</span>
                  </div>
                </div>
              </div>
              <div className="ml-4">
                <button disabled className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed">
                  Not Available
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registered Events Tab */}
      {activeTab === 'registered' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow border p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Track and Field Championship</h3>
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    Registered
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Your school is registered for this event with 15 athletes across various track and field disciplines.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>March 28-30, 2024</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>Cebu City Sports Center</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>15 athletes registered</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Registered on: Feb 20</span>
                  </div>
                </div>
              </div>
              <div className="ml-4">
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>

          <div className="text-center py-8">
            <p className="text-gray-500">No other registered events</p>
          </div>
        </div>
      )}
    </div>
  );
}