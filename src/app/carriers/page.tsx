'use client';

import React, { useState, useEffect } from 'react';
import AppLayoutWrapper from '@/components/AppLayoutWrapper';
import { Building, Plus, Phone, Mail, Trash2, X, Check, Award } from 'lucide-react';

export default function CarriersPage() {
  const [carriers, setCarriers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCarrier, setNewCarrier] = useState({
    name: '',
    code: '',
    contactPhone: '+91 1800 ',
    contactEmail: '',
    serviceType: 'Express',
    onTimeRate: 85,
    status: 'ACTIVE'
  });

  useEffect(() => {
    fetchCarriers();
  }, []);

  async function fetchCarriers() {
    try {
      setLoading(true);
      const res = await fetch('/api/carriers');
      const json = await res.json();
      setCarriers(json.carriers || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/carriers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCarrier)
      });
      if (res.ok) {
        setShowAddModal(false);
        fetchCarriers();
      }
    } catch (e) {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this carrier partner?')) return;
    try {
      await fetch(`/api/carriers/${id}`, { method: 'DELETE' });
      fetchCarriers();
    } catch (e) {}
  };

  return (
    <AppLayoutWrapper>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Building className="w-7 h-7 text-blue-600" /> Carrier Partners & Service Performance
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Multi-carrier integration SLAs, service types, and calculated on-time delivery statistics
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Carrier Partner
          </button>
        </div>

        {/* Carrier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-8 text-center text-slate-400 font-medium">Loading carrier partners...</div>
          ) : (
            carriers.map((c, idx) => {
              const barColors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-rose-500'];
              return (
                <div key={c.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative group">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider">{c.code}</span>
                      <h3 className="text-xl font-extrabold text-slate-900 mt-1">{c.name}</h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{c.serviceType} Service Partner</p>
                    </div>

                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Carrier"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* On Time Progress Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span className="flex items-center gap-1 text-slate-600"><Award className="w-4 h-4 text-amber-500" /> On-Time Rate</span>
                      <span className="text-sm font-extrabold text-slate-900">{c.onTimeRate}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${barColors[idx % barColors.length]}`}
                        style={{ width: `${c.onTimeRate}%` }}
                      />
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600 font-medium">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {c.contactPhone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> {c.contactEmail}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900">Add Carrier Partner</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Carrier Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BlueDart Express"
                    value={newCarrier.name}
                    onChange={(e) => setNewCarrier({ ...newCarrier, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Carrier Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BLUEDART"
                    value={newCarrier.code}
                    onChange={(e) => setNewCarrier({ ...newCarrier, code: e.target.value.toUpperCase() })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                    <input
                      type="text"
                      required
                      value={newCarrier.contactPhone}
                      onChange={(e) => setNewCarrier({ ...newCarrier, contactPhone: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Service Type</label>
                    <select
                      value={newCarrier.serviceType}
                      onChange={(e) => setNewCarrier({ ...newCarrier, serviceType: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="Express">Express</option>
                      <option value="Standard">Standard</option>
                      <option value="Same Day">Same Day</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newCarrier.contactEmail}
                    onChange={(e) => setNewCarrier({ ...newCarrier, contactEmail: e.target.value })}
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
                    Save Carrier
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
