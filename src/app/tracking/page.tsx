'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AppLayoutWrapper from '@/components/AppLayoutWrapper';
import { MapPin, Search, Truck, CheckCircle2, Clock, AlertTriangle, Building, ArrowRight } from 'lucide-react';
import LiveShipmentsMap from '@/components/LiveShipmentsMap';

function TrackingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState(searchParams?.get('search') || 'TRK102345');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      handleSearch(query);
    }
  }, []);

  async function handleSearch(trackingNo: string) {
    if (!trackingNo.trim()) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/tracking/${encodeURIComponent(trackingNo.trim())}`);
      if (!res.ok) {
        throw new Error('Tracking number not found in database');
      }
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <MapPin className="w-7 h-7 text-blue-600" /> Real-Time Shipment Tracking
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Search tracking number to view real-time MongoDB events, multi-leg routes & status timeline
        </p>
      </div>

      {/* Tracking Input Search */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
        <form onSubmit={onSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Tracking No. (e.g. TRK102345, TRK102346, TRK102347)"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-slate-900 outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-md shadow-blue-500/20 text-xs sm:text-sm transition-all"
          >
            {loading ? 'Searching...' : 'Track Package'}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl max-w-2xl mx-auto text-center text-xs sm:text-sm font-semibold">
          {error}
        </div>
      )}

      {/* Tracking Details View */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Shipment Overview & Vertical Timeline - 7 cols */}
          <div className="lg:col-span-7 space-y-6">
            {/* Summary Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tracking Number</span>
                  <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">{data.shipment.trackingNo}</h2>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                  data.shipment.currentStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                  data.shipment.currentStatus === 'DELAYED' ? 'bg-rose-100 text-rose-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {data.shipment.currentStatus} {data.shipment.delayDays > 0 ? `(${data.shipment.delayDays} Day Delay)` : ''}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Carrier</span>
                  <div className="font-bold text-slate-900 mt-0.5">{data.shipment.carrierName}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Order Number</span>
                  <div className="font-bold text-slate-900 mt-0.5">{data.shipment.orderNumber}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Customer</span>
                  <div className="font-bold text-slate-900 mt-0.5">{data.shipment.customerName}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Destination</span>
                  <div className="font-bold text-slate-900 mt-0.5">{data.shipment.destinationCity}</div>
                </div>
              </div>
            </div>

            {/* Visual Vertical Progress Timeline */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">Shipment Timeline Progress</h3>
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {data.timeline?.map((step: any, idx: number) => (
                  <div key={idx} className="relative flex items-start gap-4">
                    <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-white ${
                      step.completed ? 'bg-emerald-500 shadow-md shadow-emerald-500/30' : 'bg-slate-300'
                    }`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className={`text-xs sm:text-sm font-bold ${step.completed ? 'text-slate-900' : 'text-slate-400'}`}>
                        {step.step}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MongoDB Events Log Table */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">Raw MongoDB Events Log</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px]">
                      <th className="py-2 px-2">Time</th>
                      <th className="py-2 px-2">Event</th>
                      <th className="py-2 px-2">Location</th>
                      <th className="py-2 px-2">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {data.events?.map((evt: any) => (
                      <tr key={evt.id}>
                        <td className="py-2.5 px-2 font-mono text-[11px] text-slate-500">{evt.timestamp}</td>
                        <td className="py-2.5 px-2 font-bold text-blue-600">{evt.event_type}</td>
                        <td className="py-2.5 px-2 font-medium">{evt.location}</td>
                        <td className="py-2.5 px-2 text-slate-500">{evt.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Live Route Map - 5 cols */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[520px]">
              <h3 className="text-base font-bold text-slate-900 mb-3">Live Route Map</h3>
              <div className="flex-1 rounded-xl overflow-hidden">
                <LiveShipmentsMap />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackingPage() {
  return (
    <AppLayoutWrapper>
      <Suspense fallback={<div className="p-8 text-center text-slate-400 font-medium">Loading tracking page...</div>}>
        <TrackingContent />
      </Suspense>
    </AppLayoutWrapper>
  );
}
