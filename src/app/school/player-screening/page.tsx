'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserCheck, Upload, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

interface User {
  email: string;
  role: string;
  isAuthenticated: boolean;
}

export default function SchoolPlayerScreeningPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
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
          <UserCheck className="h-6 w-6 text-blue-600" />
          Player Screening
        </h1>
        <p className="text-gray-600 mt-1">Manage player eligibility and documentation</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-green-600">28</div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-yellow-600">8</div>
              <div className="text-sm text-gray-600">Pending Review</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-red-600">3</div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-orange-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-orange-600">5</div>
              <div className="text-sm text-gray-600">Missing Documents</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pending Review
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'upload'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Upload Documents
            </button>
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Submissions</h2>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-medium">JD</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Juan Dela Cruz</h3>
                      <p className="text-xs text-gray-500">Basketball • Grade 11</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Submitted: Feb 20, 2024</div>
                      <div className="text-xs text-gray-500">Medical Certificate, Birth Certificate</div>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Approved
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm font-medium">MS</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Maria Santos</h3>
                      <p className="text-xs text-gray-500">Swimming • Grade 10</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Submitted: Feb 18, 2024</div>
                      <div className="text-xs text-gray-500">All documents complete</div>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                      Under Review
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 text-sm font-medium">AL</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Alex Lopez</h3>
                      <p className="text-xs text-gray-500">Track & Field • Grade 12</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Submitted: Feb 15, 2024</div>
                      <div className="text-xs text-red-500">Missing: School ID</div>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                      Incomplete
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pending Review Tab */}
      {activeTab === 'pending' && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Pending Review (8)</h2>
          </div>
          <div className="divide-y divide-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-medium">RC</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Roberto Cruz</h3>
                    <p className="text-xs text-gray-500">Volleyball • Grade 11</p>
                    <p className="text-xs text-gray-500">Submitted: 2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors">
                    Approve
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors">
                    Reject
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs transition-colors">
                    View Documents
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm font-medium">LG</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Lisa Garcia</h3>
                    <p className="text-xs text-gray-500">Badminton • Grade 9</p>
                    <p className="text-xs text-gray-500">Submitted: 1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors">
                    Approve
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors">
                    Reject
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs transition-colors">
                    View Documents
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Documents Tab */}
      {activeTab === 'upload' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Player Documents</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Documents</h3>
            <p className="text-gray-600 mb-4">
              Drag and drop files here, or click to select files
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Select Files
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: PDF, JPG, PNG (Max 10MB per file)
            </p>
          </div>
          
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Required Documents:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Birth Certificate</li>
              <li>• Medical Certificate (not older than 6 months)</li>
              <li>• School ID or Enrollment Certificate</li>
              <li>• Parent/Guardian Consent Form</li>
              <li>• Insurance Coverage (if applicable)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}