'use client';

import React, { useState, useEffect } from 'react';
import AppLayoutWrapper from '@/components/AppLayoutWrapper';
import { Store, Plus, MapPin, User, Trash2, X, AlertTriangle } from 'lucide-react';

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWh, setNewWh] = useState({
    name: '',
    location: '',
    city: 'Bangalore',
    state: 'Karnataka',
    capacity: 10000,
    currentUtilization: 5000,
    managerName: 'Manager'
  });

  useEffect(() => {
    fetchWarehouses();
  }, []);

  async function fetchWarehouses() {
    try {
      setLoading(true);
      const res = await fetch('/api/warehouses');
      const json = await res.json();
      setWarehouses(json.warehouses || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/warehouses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWh)
      });
      if (res.ok) {
        setShowAddModal(false);
        fetchWarehouses();
      }
    } catch (e) {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this warehouse hub?')) return;
    try {
      await fetch(`/api/warehouses/${id}`, { method: 'DELETE' });
      fetchWarehouses();
    } catch (e) {}
  };

  return (
    <AppLayoutWrapper>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Store className="w-7 h-7 text-blue-600" /> Warehouses & Logistics Hubs
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Hub storage capacities, real-time volume utilization, and fulfillment center operations
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Warehouse Hub
          </button>
        </div>

        {/* Warehouse Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full py-8 text-center text-slate-400 font-medium">Loading warehouse hubs...</div>
          ) : (
            warehouses.map((w) => {
              const utilPct = Math.round((w.currentUtilization / w.capacity) * 100);
              const isHigh = utilPct >= 85;

              return (
                <div key={w.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative group">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md uppercase">{w.city}, {w.state}</span>
                      <h3 className="text-lg font-bold text-slate-900 mt-1">{w.name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {w.location}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDelete(w.id)}
                      className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Warehouse"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Utilization Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-600">Capacity Utilization</span>
                      <span className={`font-extrabold ${isHigh ? 'text-rose-600' : 'text-slate-900'}`}>{utilPct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isHigh ? 'bg-rose-500' : utilPct > 65 ? 'bg-amber-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${utilPct}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium flex justify-between">
                      <span>{w.currentUtilization.toLocaleString()} used</span>
                      <span>{w.capacity.toLocaleString()} max</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <User className="w-3.5 h-3.5 text-slate-400" /> Manager: {w.managerName}
                    </span>
                    {isHigh && (
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <AlertTriangle className="w-3 h-3" /> Near Capacity
                      </span>
                    )}
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
                <h3 className="text-lg font-bold text-slate-900">Add Warehouse Hub</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Warehouse Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bangalore Central Warehouse"
                    value={newWh.name}
                    onChange={(e) => setNewWh({ ...newWh, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Peenya Industrial Zone"
                    value={newWh.location}
                    onChange={(e) => setNewWh({ ...newWh, location: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={newWh.city}
                      onChange={(e) => setNewWh({ ...newWh, city: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={newWh.state}
                      onChange={(e) => setNewWh({ ...newWh, state: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Total Capacity</label>
                    <input
                      type="number"
                      required
                      value={newWh.capacity}
                      onChange={(e) => setNewWh({ ...newWh, capacity: Number(e.target.value) })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Current Utilization</label>
                    <input
                      type="number"
                      required
                      value={newWh.currentUtilization}
                      onChange={(e) => setNewWh({ ...newWh, currentUtilization: Number(e.target.value) })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Manager Name</label>
                  <input
                    type="text"
                    required
                    value={newWh.managerName}
                    onChange={(e) => setNewWh({ ...newWh, managerName: e.target.value })}
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
                    Save Hub
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
