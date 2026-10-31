'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayoutWrapper from '@/components/AppLayoutWrapper';
import { ArrowLeft, Search, Filter, MapPin, RefreshCw, AlertCircle } from 'lucide-react';
import LiveShipmentsMap from '@/components/LiveShipmentsMap';

export default function LiveMapPage() {
  const router = useRouter();

  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrackingNo, setSelectedTrackingNo] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  useEffect(() => {
    fetchLiveShipments();
    const interval = setInterval(fetchLiveShipments, 30000);
    return () => clearInterval(interval);
  }, [statusFilter]);

  async function fetchLiveShipments() {
    try {
      setLoading(true);
      const res = await fetch(`/api/tracking/live?status=${encodeURIComponent(statusFilter)}`);
      const json = await res.json();
      if (json.shipments) {
        setShipments(json.shipments);
        setLastRefreshed(new Date().toLocaleTimeString());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    if (!searchQuery.trim()) {
      setSelectedTrackingNo(undefined);
      return;
    }

    const q = searchQuery.trim().toUpperCase();
    const found = shipments.find(s => s.trackingNo.toUpperCase() === q || s.orderId.toUpperCase() === q);
    if (found) {
      setSelectedTrackingNo(found.trackingNo);
    } else {
      setSearchError(`No shipment found matching "${searchQuery}"`);
      setTimeout(() => setSearchError(null), 4000);
    }
  };

  return (
    <AppLayoutWrapper>
      <div className="p-4 sm:p-6 lg:p-8 space-y-4 max-w-[1700px] mx-auto flex flex-col h-[calc(100vh-80px)]">
        {/* Top Header & Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors font-semibold text-xs sm:text-sm flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
            <div className="h-6 w-px bg-slate-200 hidden sm:block" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-blue-600" /> Live Shipment Tracking
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Real-time shipment locations and routes across India logistics networks
              </p>
            </div>
          </div>

          {/* Search & Status Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Tracking No. (e.g. TRK102345)..."
                className="pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none w-56 sm:w-64"
              />
            </form>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setSelectedTrackingNo(undefined);
                }}
                className="bg-white border border-slate-200 text-xs sm:text-sm rounded-xl px-3 py-2 font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="IN_TRANSIT">In Transit</option>
                <option value="AT_HUB">At Hub</option>
                <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                <option value="DELIVERED">Delivered</option>
                <option value="DELAYED">Delayed</option>
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => fetchLiveShipments()}
              disabled={loading}
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-white bg-slate-100 rounded-xl border border-slate-200 transition-colors"
              title={`Last updated: ${lastRefreshed}`}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
            </button>
          </div>
        </div>

        {searchError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {searchError}
          </div>
        )}

        {/* Map Container Area */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative flex flex-col min-h-[500px]">
          <LiveShipmentsMap
            shipmentsData={shipments}
            selectedTrackingNo={selectedTrackingNo}
            filterStatus={statusFilter}
            height="100%"
            autoRefresh={true}
          />

          {/* Map Status Color Legend */}
          <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-200/80 shadow-lg text-xs font-semibold text-slate-700 flex flex-wrap items-center gap-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Legend:</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500" /> In Transit</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-purple-500" /> At Hub</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500" /> Out for Delivery</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500" /> Delayed</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500" /> Delivered</span>
          </div>
        </div>
      </div>
    </AppLayoutWrapper>
  );
}
