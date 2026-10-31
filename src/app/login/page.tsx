'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, Shield, Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@shiptrack.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Authentication failed');
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <div className="min-h-screen bg-[#0B132B] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl space-y-6 relative z-10 border border-slate-100">
        {/* Logo & Heading */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
            <Truck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">ShipTrack Sign In</h1>
          <p className="text-xs text-slate-500 font-medium">Multi-Carrier Shipment Tracking & Analytics System</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Credentials Selector */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <p className="text-[11px] font-bold text-slate-400 text-center uppercase tracking-wider">Quick Fill Demo Roles</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => fillDemoUser('admin@shiptrack.com')}
              className="p-2 bg-slate-50 hover:bg-blue-50 text-slate-700 font-semibold rounded-xl border border-slate-200 transition-colors text-left"
            >
              👑 Admin User
            </button>
            <button
              onClick={() => fillDemoUser('rajesh@shiptrack.com')}
              className="p-2 bg-slate-50 hover:bg-blue-50 text-slate-700 font-semibold rounded-xl border border-slate-200 transition-colors text-left"
            >
              🏭 Warehouse Staff
            </button>
            <button
              onClick={() => fillDemoUser('vikram@bluedart.com')}
              className="p-2 bg-slate-50 hover:bg-blue-50 text-slate-700 font-semibold rounded-xl border border-slate-200 transition-colors text-left"
            >
              🚚 Carrier Driver
            </button>
            <button
              onClick={() => fillDemoUser('rohit@gmail.com')}
              className="p-2 bg-slate-50 hover:bg-blue-50 text-slate-700 font-semibold rounded-xl border border-slate-200 transition-colors text-left"
            >
              👤 Customer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
