'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RoleToggle, { Role } from '@components/RoleToggle';

export default function LoginPage() {
  const [role, setRole] = useState<Role>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simple validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      
      // eme login
      localStorage.setItem('user', JSON.stringify({
        email,
        role,
        isAuthenticated: true
      }));

      // Redirect based on role
      const roleRoutes = {
        'admin': '/admin',
        'staff': '/staff',
        'school': '/school',
        'coach': '/coach'
      };

      router.push(roleRoutes[role]);
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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

      <div className="w-[29rem] rounded-xl bg-white/95 shadow-xl p-8 relative z-10 backdrop-blur-sm border border-white/20">
        <h2 className="text-xl font-semibold mb-6">
          Login to <span className="text-[#053D5E]">BucalTrack!</span>
        </h2>

        <form onSubmit={handleLogin}>
          {/* Role selector */}
          <div className="mb-6">
            <RoleToggle value={role} onChange={setRole} />
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              {role === 'admin' ? 'BUCAL Admin Email' : 'Email'}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={role === 'admin' ? 'bucaladmin@gmail.com' : 'Enter your email'}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-[#04304B] focus:border-transparent
                         transition-all duration-200 hover:border-gray-400"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-[#04304B] focus:border-transparent
                         transition-all duration-200 hover:border-gray-400"
              required
            />
          </div>

          {/* Sign-up option for School accounts */}
          {role === 'school' && (
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

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-[#1e3a5f] hover:bg-[#2a4a6b] py-3.5 text-white font-medium 
                       transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]
                       active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/50 focus:ring-offset-2
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}