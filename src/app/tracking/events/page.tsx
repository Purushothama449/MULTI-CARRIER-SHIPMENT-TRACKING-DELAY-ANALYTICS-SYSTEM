'use client';

import React, { useState, useEffect } from 'react';
import AppLayoutWrapper from '@/components/AppLayoutWrapper';
import { Database, Plus, Radio, X, Search } from 'lucide-react';

export default function TrackingEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    shipment_id: 'shp-102345',
    tracking_no: 'TRK102345',
    event_type: 'LOCATION_UPDATE',
    location: 'Bangalore Hub',
    remarks: 'Package scanned at sorting conveyor'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      setLoading(true);
      const res = await fetch('/api/tracking/events');
      const json = await res.json();
      setEvents(json.events || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/tracking/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent)
      });
      if (res.ok) {
        setShowAddModal(false);
        fetchEvents();
      }
    } catch (e) {}
  };

  return (
    <AppLayoutWrapper>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Database className="w-7 h-7 text-blue-600" /> MongoDB Tracking Events Collection
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              High-throughput MongoDB document collection logging scanner & driver app events
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Log New Event
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Tracking No.</th>
                  <th className="py-3 px-4">Event Type</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Source Device</th>
                  <th className="py-3 px-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">Loading MongoDB collection...</td>
                  </tr>
                ) : (
                  events.map((evt) => (
                    <tr key={evt.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-500 text-xs">{evt.timestamp}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{evt.tracking_no}</td>
                      <td className="py-3.5 px-4 font-semibold text-blue-700 flex items-center gap-2">
                        <Radio className="w-4 h-4 text-blue-500" />
                        {evt.event_type}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">{evt.location}</td>
                      <td className="py-3.5 px-4 text-slate-500 text-xs font-semibold">{evt.source_device}</td>
                      <td className="py-3.5 px-4 text-slate-600">{evt.remarks}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900">Insert Event into MongoDB</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddEvent} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tracking Number</label>
                  <input
                    type="text"
                    required
                    value={newEvent.tracking_no}
                    onChange={(e) => setNewEvent({ ...newEvent, tracking_no: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Event Type</label>
                  <select
                    value={newEvent.event_type}
                    onChange={(e) => setNewEvent({ ...newEvent, event_type: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="LOCATION_UPDATE">LOCATION_UPDATE</option>
                    <option value="HUB_SCAN">HUB_SCAN</option>
                    <option value="PICKUP">PICKUP</option>
                    <option value="DEPARTED_HUB">DEPARTED_HUB</option>
                    <option value="ARRIVED_HUB">ARRIVED_HUB</option>
                    <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="DELAY_REPORTED">DELAY_REPORTED</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Remarks</label>
                  <input
                    type="text"
                    required
                    value={newEvent.remarks}
                    onChange={(e) => setNewEvent({ ...newEvent, remarks: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-500/20"
                  >
                    Insert Document
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayoutWrapper>
  );
}
