'use client';

import React, { useState } from 'react';
import AppLayoutWrapper from '@/components/AppLayoutWrapper';
import { Settings, User, Shield, Bell, Database, Check } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@shiptrack.com',
    role: 'System Administrator',
    notifications: true,
    dbLogging: true
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AppLayoutWrapper>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Settings className="w-7 h-7 text-blue-600" /> System Settings & Preferences
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your account security, notification alerts, and database configurations
          </p>
        </div>

        {/* Settings Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-4 text-xs sm:text-sm font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'profile' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" /> Profile Settings
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'security' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4" /> Security & Passwords
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'notifications' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Bell className="w-4 h-4" /> Notification Alerts
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-2xl">
          {saved && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4" /> Settings updated successfully!
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
            {activeTab === 'profile' && (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role Title</label>
                  <input
                    type="text"
                    disabled
                    value={profile.role}
                    className="w-full p-2.5 bg-slate-100 border border-slate-200 text-slate-500 rounded-xl outline-none"
                  />
                </div>
              </>
            )}

            {activeTab === 'security' && (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    defaultValue="••••••••"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new strong password"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.notifications}
                    onChange={(e) => setProfile({ ...profile, notifications: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="font-semibold text-slate-800">Receive email alerts on shipment delay detection</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.dbLogging}
                    onChange={(e) => setProfile({ ...profile, dbLogging: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="font-semibold text-slate-800">Log MongoDB raw event stream details</span>
                </label>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 transition-all"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayoutWrapper>
  );
}
