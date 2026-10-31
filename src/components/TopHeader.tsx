'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Search, Bell, LogOut, User, Settings, Check, Truck, Package } from 'lucide-react';

interface TopHeaderProps {
  onToggleSidebar: () => void;
}

export default function TopHeader({ onToggleSidebar }: TopHeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Search Input
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    setIsSearching(true);
    setShowSearchDropdown(true);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/shipments?search=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setSearchResults(data.shipments || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectResult = (item: any) => {
    setShowSearchDropdown(false);
    setSearchQuery('');
    router.push(`/tracking?search=${item.trackingNo}`);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-4 lg:px-8 py-3 flex items-center justify-between shadow-sm">
      {/* Left Menu Toggle & Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tracking number, order ID, customer, or shipment..."
              className="w-full pl-10 pr-4 py-2 text-xs md:text-sm bg-slate-100/90 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Search Dropdown Results */}
          {showSearchDropdown && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 max-h-80 overflow-y-auto z-50 p-2 space-y-1">
              {isSearching ? (
                <div className="p-4 text-center text-xs text-slate-500">Searching shipments...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectResult(item)}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-blue-50 flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-800">{item.trackingNo} ({item.orderNumber})</div>
                        <div className="text-[11px] text-slate-500">{item.customerName} • {item.destinationCity}</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      item.currentStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                      item.currentStatus === 'DELAYED' ? 'bg-rose-100 text-rose-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {item.currentStatus}
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-500">No matching shipments found.</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right User Controls */}
      <div className="flex items-center gap-3">
        {/* Notifications Icon */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
              3
            </span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800">System Notifications</h4>
                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">3 New</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                <div className="p-3 hover:bg-slate-50 cursor-pointer">
                  <div className="flex items-center gap-2 text-rose-600 text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-rose-500" /> Shipment TRK102353 delayed by 4 days
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Delhi Hub bottleneck reported by carrier</div>
                  <div className="text-[10px] text-slate-400 mt-1">2 hours ago</div>
                </div>
                <div className="p-3 hover:bg-slate-50 cursor-pointer">
                  <div className="flex items-center gap-2 text-amber-600 text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> Warehouse Bangalore capacity at 90%
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Utilization high in Peenya Hub</div>
                  <div className="text-[10px] text-slate-400 mt-1">5 hours ago</div>
                </div>
                <div className="p-3 hover:bg-slate-50 cursor-pointer">
                  <div className="flex items-center gap-2 text-blue-600 text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-blue-500" /> Carrier DTDC delivery rating dropped
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Performance update logged</div>
                  <div className="text-[10px] text-slate-400 mt-1">1 day ago</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-md shadow-blue-500/20">
              A
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-800">Admin</div>
              <div className="text-[10px] text-slate-500 font-medium">System Administrator</div>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-1 divide-y divide-slate-100">
              <div className="p-2.5">
                <div className="text-xs font-bold text-slate-800">Admin User</div>
                <div className="text-[11px] text-slate-500">admin@shiptrack.com</div>
              </div>
              <div className="py-1">
                <button
                  onClick={() => { setShowProfileMenu(false); router.push('/settings'); }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2"
                >
                  <Settings className="w-4 h-4 text-slate-500" /> Account Settings
                </button>
                <button
                  onClick={() => { setShowProfileMenu(false); router.push('/users'); }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-slate-500" /> Manage Users
                </button>
              </div>
              <div className="pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 font-semibold"
                >
                  <LogOut className="w-4 h-4 text-rose-600" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
