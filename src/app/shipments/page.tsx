'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AppLayoutWrapper from '@/components/AppLayoutWrapper';
import { Truck, Plus, Search, Filter, Eye, Edit3, Trash2, X, Check } from 'lucide-react';

function ShipmentsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [shipments, setShipments] = useState<any[]>([]);
  const [carriers, setCarriers] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams?.get('status') || 'ALL');

  // Create Shipment Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newShipment, setNewShipment] = useState({
    trackingNo: `TRK${Math.floor(100000 + Math.random() * 900000)}`,
    orderId: 'ord-1001',
    orderNumber: 'ORD1001',
    carrierId: '',
    carrierName: '',
    originWarehouseId: '',
    originWarehouseName: '',
    customerName: 'Rohit Sharma',
    destinationCity: 'Mumbai',
    expectedDelivery: '2025-10-05T18:00:00Z',
    currentStatus: 'IN_TRANSIT',
    currentLocation: 'Origin Warehouse'
  });

  // Status Update Modal
  const [updateTarget, setUpdateTarget] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('IN_TRANSIT');
  const [newLocation, setNewLocation] = useState('');
  const [delayDays, setDelayDays] = useState(0);

  // Delete Target
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchShipments();
    fetchMetadata();
  }, [search, statusFilter]);

  async function fetchShipments() {
    try {
      setLoading(true);
      const res = await fetch(`/api/shipments?search=${encodeURIComponent(search)}&status=${encodeURIComponent(statusFilter)}`);
      const json = await res.json();
      setShipments(json.shipments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMetadata() {
    try {
      const [carRes, whRes] = await Promise.all([
        fetch('/api/carriers'),
        fetch('/api/warehouses')
      ]);
      const carData = await carRes.json();
      const whData = await whRes.json();
      setCarriers(carData.carriers || []);
      setWarehouses(whData.warehouses || []);
    } catch (e) {}
  }

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/shipments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newShipment)
      });
      if (res.ok) {
        setShowCreateModal(false);
        fetchShipments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateTarget) return;
    try {
      const res = await fetch(`/api/shipments/${updateTarget.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentStatus: newStatus,
          currentLocation: newLocation,
          delayDays: Number(delayDays)
        })
      });
      if (res.ok) {
        setUpdateTarget(null);
        fetchShipments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/shipments/${deleteId}`, { method: 'DELETE' });
      setDeleteId(null);
      fetchShipments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Truck className="w-7 h-7 text-blue-600" /> Shipments Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Multi-carrier dispatch control, routing, and real-time transit status
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Create Shipment
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by tracking number, order number, or customer..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-100 border border-slate-200 text-xs sm:text-sm rounded-xl px-3 py-2 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="PICKED_UP">PICKED UP</option>
            <option value="IN_TRANSIT">IN TRANSIT</option>
            <option value="AT_HUB">AT HUB</option>
            <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="DELAYED">DELAYED</option>
          </select>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Tracking No.</th>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Carrier</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Origin Hub</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 font-medium">Loading shipments...</td>
                </tr>
              ) : shipments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 font-medium">No shipments found.</td>
                </tr>
              ) : (
                shipments.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{s.trackingNo}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-500">{s.orderNumber || s.orderId}</td>
                    <td className="py-3.5 px-4 font-semibold text-blue-700">{s.carrierName}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{s.customerName}</td>
                    <td className="py-3.5 px-4 text-slate-600">{s.originWarehouseName}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{s.currentLocation}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        s.currentStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                        s.currentStatus === 'DELAYED' ? 'bg-rose-100 text-rose-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {s.currentStatus} {s.delayDays > 0 ? `(${s.delayDays}d)` : ''}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => router.push(`/tracking?search=${s.trackingNo}`)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Live Timeline"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setUpdateTarget(s);
                          setNewStatus(s.currentStatus);
                          setNewLocation(s.currentLocation);
                          setDelayDays(s.delayDays || 0);
                        }}
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Update Status"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(s.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Shipment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Shipment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Create New Shipment</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateShipment} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tracking Number</label>
                  <input
                    type="text"
                    required
                    value={newShipment.trackingNo}
                    onChange={(e) => setNewShipment({ ...newShipment, trackingNo: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={newShipment.customerName}
                    onChange={(e) => setNewShipment({ ...newShipment, customerName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assign Carrier</label>
                  <select
                    required
                    value={newShipment.carrierId}
                    onChange={(e) => {
                      const car = carriers.find(c => c.id === e.target.value);
                      setNewShipment({
                        ...newShipment,
                        carrierId: e.target.value,
                        carrierName: car?.name || 'Carrier'
                      });
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select Carrier</option>
                    {carriers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Origin Warehouse</label>
                  <select
                    required
                    value={newShipment.originWarehouseId}
                    onChange={(e) => {
                      const wh = warehouses.find(w => w.id === e.target.value);
                      setNewShipment({
                        ...newShipment,
                        originWarehouseId: e.target.value,
                        originWarehouseName: wh?.name || 'Warehouse'
                      });
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select Warehouse</option>
                    {warehouses.map(w => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Destination City</label>
                  <input
                    type="text"
                    required
                    value={newShipment.destinationCity}
                    onChange={(e) => setNewShipment({ ...newShipment, destinationCity: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Current Location</label>
                  <input
                    type="text"
                    required
                    value={newShipment.currentLocation}
                    onChange={(e) => setNewShipment({ ...newShipment, currentLocation: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-500/20"
                >
                  Dispatch Shipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {updateTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Update Status: {updateTarget.trackingNo}</h3>
              <button onClick={() => setUpdateTarget(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="PICKED_UP">PICKED UP</option>
                  <option value="IN_TRANSIT">IN TRANSIT</option>
                  <option value="AT_HUB">AT HUB</option>
                  <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="DELAYED">DELAYED</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Location Hub</label>
                <input
                  type="text"
                  required
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Delay Days (If applicable)</label>
                <input
                  type="number"
                  value={delayDays}
                  onChange={(e) => setDelayDays(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUpdateTarget(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-500/20"
                >
                  Update Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Delete Shipment?</h3>
            <p className="text-xs text-slate-500">Permanently remove this shipment tracking record?</p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs sm:text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-rose-500/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShipmentsPage() {
  return (
    <AppLayoutWrapper>
      <Suspense fallback={<div className="p-8 text-center text-slate-400 font-medium">Loading shipments page...</div>}>
        <ShipmentsContent />
      </Suspense>
    </AppLayoutWrapper>
  );
}
