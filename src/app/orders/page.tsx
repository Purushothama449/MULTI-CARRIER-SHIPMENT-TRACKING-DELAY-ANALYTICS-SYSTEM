'use client';

import React, { useState, useEffect } from 'react';
import AppLayoutWrapper from '@/components/AppLayoutWrapper';
import { ShoppingBag, Plus, Search, Filter, Trash2, Eye, X, Check } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // New Order Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    orderNumber: `ORD${Math.floor(1000 + Math.random() * 9000)}`,
    customerId: '',
    customerName: '',
    totalAmount: 999,
    status: 'PENDING',
    itemsCount: 1
  });

  // Delete Dialog State
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
  }, [search, statusFilter]);

  async function fetchOrders() {
    try {
      setLoading(true);
      const res = await fetch(`/api/orders?search=${encodeURIComponent(search)}&status=${encodeURIComponent(statusFilter)}`);
      const json = await res.json();
      setOrders(json.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCustomers() {
    try {
      const res = await fetch('/api/carriers'); // fallback or customers endpoint
      // Seed customers list for creation dropdown
      setCustomers([
        { id: 'cust-1', name: 'Rohit Sharma' },
        { id: 'cust-2', name: 'Priya Mehta' },
        { id: 'cust-3', name: 'Arjun Kumar' },
        { id: 'cust-4', name: 'Sneha Reddy' },
        { id: 'cust-5', name: 'Karan Patel' },
      ]);
    } catch (e) {}
  }

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
      if (res.ok) {
        setShowCreateModal(false);
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteOrder = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/orders/${deleteId}`, { method: 'DELETE' });
      setDeleteId(null);
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppLayoutWrapper>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-7 h-7 text-blue-600" /> Orders Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              View, create, and manage customer orders and dispatch statuses
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Create Order
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
              placeholder="Search by order number or customer name..."
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
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Order Date</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">Loading orders...</td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">No orders found.</td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{o.orderNumber}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{o.customerName}</td>
                      <td className="py-3.5 px-4 text-slate-500">{new Date(o.orderDate).toLocaleDateString()}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">₹{o.totalAmount.toLocaleString()}</td>
                      <td className="py-3.5 px-4 font-medium text-slate-600">{o.itemsCount} item(s)</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          o.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                          o.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                          o.status === 'PROCESSING' ? 'bg-purple-100 text-purple-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setDeleteId(o.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Order"
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

        {/* Create Order Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900">Create New Order</h3>
                <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateOrder} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Order Number</label>
                  <input
                    type="text"
                    required
                    value={newOrder.orderNumber}
                    onChange={(e) => setNewOrder({ ...newOrder, orderNumber: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer</label>
                  <select
                    required
                    value={newOrder.customerId}
                    onChange={(e) => {
                      const selected = customers.find(c => c.id === e.target.value);
                      setNewOrder({
                        ...newOrder,
                        customerId: e.target.value,
                        customerName: selected?.name || 'Customer'
                      });
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select Customer</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Total Amount (₹)</label>
                    <input
                      type="number"
                      required
                      value={newOrder.totalAmount}
                      onChange={(e) => setNewOrder({ ...newOrder, totalAmount: Number(e.target.value) })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Items Count</label>
                    <input
                      type="number"
                      required
                      value={newOrder.itemsCount}
                      onChange={(e) => setNewOrder({ ...newOrder, itemsCount: Number(e.target.value) })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Initial Status</label>
                  <select
                    value={newOrder.status}
                    onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                  </select>
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
                    Submit Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteId && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Delete Order?</h3>
              <p className="text-xs text-slate-500">Are you sure you want to permanently delete this order? This action cannot be undone.</p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteOrder}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-rose-500/20"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayoutWrapper>
  );
}
