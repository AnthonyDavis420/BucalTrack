'use client';

import { useState } from 'react';
import RoleToggle, { Role } from '@components/RoleToggle';   // <-- updated

export default function LoginPage() {
  const [role, setRole] = useState<Role>('Admin');

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        backgroundImage: 'url(/LogoBucal.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#f1f5f9',
      }}
    >
      <div className="absolute inset-0 bg-slate-100/70" style={{ zIndex: -1 }} />

      <div className="text-center mb-4 relative z-10">
        <h1 className="text-3xl font-bold text-[#053D5E]">BucalTrack</h1>
        <p className="text-sm text-gray-600">
          Sports Event Management for BUCAL
        </p>
      </div>

      <div className="w-[28rem] rounded-xl bg-white/95 shadow-xl p-8 relative z-10 backdrop-blur-sm border border-white/20">
        <h2 className="text-xl font-semibold mb-6">
          Login to <span className="text-[#053D5E]">BucalTrack!</span>
        </h2>

        {/* Role selector */}
        <div className="mb-6">
          <RoleToggle value={role} onChange={setRole} />
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
            {role === 'Admin' ? 'BUCAL Admin Email' : 'Email'}
          </label>
          <input
            type="email"
            placeholder={role === 'Admin' ? 'bucaladmin@gmail.com' : 'Enter your email'}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm 
                       focus:outline-none focus:ring-2 focus:ring-[#04304B] focus:border-transparent
                       transition-all duration-200 hover:border-gray-400"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter password"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm 
                       focus:outline-none focus:ring-2 focus:ring-[#04304B] focus:border-transparent
                       transition-all duration-200 hover:border-gray-400"
          />
        </div>

        {/* Sign-up option for School accounts */}
        {role === 'School' && (
          <div className="mb-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account yet?{' '}
              <button
                type="button"
                className="text-[#04304B] hover:text-[#053D5E] font-medium underline
                           transition-colors duration-200"
              >
                Click here to Sign-up!
              </button>
            </p>
          </div>
        )}

        <button
          type="button"
          className="w-full rounded-xl bg-[#1e3a5f] hover:bg-[#2a4a6b] py-3.5 text-white font-medium 
                     transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]
                     active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/50 focus:ring-offset-2"
        >
          Login
        </button>
      </div>
    </div>
  );
}