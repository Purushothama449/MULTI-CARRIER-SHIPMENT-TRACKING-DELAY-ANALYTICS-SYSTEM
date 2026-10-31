'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Users,
  Eye,
  Calendar,
  ChevronDown,
  ArrowUpRight,
  Radio,
  ShieldAlert
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import LiveShipmentsMap from './LiveShipmentsMap';

export default function DashboardView() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [dateRange, setDateRange] = useState('Sep 1, 2025 - Sep 30, 2025');

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/analytics/dashboard?dateRange=${encodeURIComponent(dateRange)}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [dateRange]);

  if (loading || !data) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-lg w-1/4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-72 bg-slate-200 rounded-2xl col-span-2" />
          <div className="h-72 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  const { kpi, trends, statusDistribution, carrierPerformance, recentShipments, delayedShipments, trackingEvents, alerts } = data;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Dashboard Top Title & Date Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Overview of shipments, deliveries, analytics and carrier performance
          </p>
        </div>

        {/* Date Filter Dropdown */}
        <div className="relative inline-flex items-center">
          <div className="flex items-center gap-2 bg-white border border-slate-200 shadow-sm rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-slate-300 transition-colors cursor-pointer">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>{dateRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </div>
        </div>
      </div>

      {/* 5 KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Shipments */}
        <div
          onClick={() => router.push('/shipments')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div className="text-right">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Shipments</p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">{kpi?.totalShipments || 248}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-emerald-600 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> 12%
            </span>
            <span className="text-slate-400 text-[11px]">vs last month</span>
          </div>
          <div className="h-8 mt-2 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[{ v: 10 }, { v: 18 }, { v: 14 }, { v: 22 }, { v: 28 }, { v: 35 }]}>
                <Area type="monotone" dataKey="v" stroke="#3B82F6" fill="#EFF6FF" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* In Transit */}
        <div
          onClick={() => router.push('/shipments?status=IN_TRANSIT')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <div className="text-right">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">In Transit</p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">{kpi?.inTransit || 102}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-emerald-600 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> 8%
            </span>
            <span className="text-slate-400 text-[11px]">vs last month</span>
          </div>
          <div className="h-8 mt-2 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[{ v: 8 }, { v: 12 }, { v: 10 }, { v: 15 }, { v: 18 }, { v: 24 }]}>
                <Area type="monotone" dataKey="v" stroke="#10B981" fill="#ECFDF5" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Delivered */}
        <div
          onClick={() => router.push('/shipments?status=DELIVERED')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-right">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Delivered</p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">{kpi?.delivered || 121}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-emerald-600 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> 15%
            </span>
            <span className="text-slate-400 text-[11px]">vs last month</span>
          </div>
          <div className="h-8 mt-2 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[{ v: 12 }, { v: 16 }, { v: 20 }, { v: 25 }, { v: 30 }, { v: 38 }]}>
                <Area type="monotone" dataKey="v" stroke="#10B981" fill="#ECFDF5" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Delayed */}
        <div
          onClick={() => router.push('/shipments?status=DELAYED')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-right">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Delayed</p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">{kpi?.delayed || 25}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-rose-600 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> 20%
            </span>
            <span className="text-slate-400 text-[11px]">vs last month</span>
          </div>
          <div className="h-8 mt-2 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[{ v: 5 }, { v: 9 }, { v: 7 }, { v: 12 }, { v: 15 }, { v: 20 }]}>
                <Area type="monotone" dataKey="v" stroke="#EF4444" fill="#FEF2F2" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Total Orders */}
        <div
          onClick={() => router.push('/orders')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-right">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Orders</p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">{kpi?.totalOrders || 310}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-emerald-600 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> 10%
            </span>
            <span className="text-slate-400 text-[11px]">vs last month</span>
          </div>
          <div className="h-8 mt-2 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[{ v: 15 }, { v: 22 }, { v: 28 }, { v: 34 }, { v: 42 }, { v: 50 }]}>
                <Area type="monotone" dataKey="v" stroke="#8B5CF6" fill="#F5F3FF" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* MIDDLE CHARTS ROW (3 Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Shipment Trends - 5 cols */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm lg:col-span-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Shipment Trends</h3>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1 text-blue-600"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Total</span>
              <span className="flex items-center gap-1 text-emerald-600"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Delivered</span>
              <span className="flex items-center gap-1 text-rose-600"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Delayed</span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends}>
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '12px', border: 'none' }} />
                <Area type="monotone" dataKey="Total" stroke="#2563EB" fill="#DBEAFE" fillOpacity={0.4} strokeWidth={2.5} />
                <Area type="monotone" dataKey="Delivered" stroke="#10B981" fill="#D1FAE5" fillOpacity={0.4} strokeWidth={2.5} />
                <Area type="monotone" dataKey="Delayed" stroke="#EF4444" fill="#FEE2E2" fillOpacity={0.4} strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Shipment Status Distribution - 4 cols */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm lg:col-span-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Shipment Status Distribution</h3>
          </div>
          <div className="h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusDistribution?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-extrabold text-slate-900">{kpi?.totalShipments || 248}</span>
              <span className="text-xs text-slate-400 font-medium">Total</span>
            </div>
          </div>
          <div className="space-y-1.5 pt-2">
            {statusDistribution?.map((item: any) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-700 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-bold text-slate-900">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Carrier Performance - 3 cols */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm lg:col-span-3 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Carrier Performance</h3>
            <Link href="/carriers" className="text-xs font-semibold text-blue-600 hover:text-blue-700">View All</Link>
          </div>
          <p className="text-xs text-slate-500 mb-4">(On-Time Delivery Rate)</p>
          <div className="space-y-4 flex-1">
            {carrierPerformance?.map((carrier: any, idx: number) => {
              const barColors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-rose-500'];
              return (
                <div key={carrier.id || carrier.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                    <span>{carrier.name}</span>
                    <span className="font-bold">{carrier.onTimeRate}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColors[idx % barColors.length]}`}
                      style={{ width: `${carrier.onTimeRate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* BOTTOM ROW 1 (3 Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Shipments Table - 5 cols */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm lg:col-span-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Recent Shipments</h3>
            <Link href="/shipments" className="text-xs font-semibold text-blue-600 hover:text-blue-700">View All</Link>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-2">Tracking No.</th>
                  <th className="py-2.5 px-2">Order ID</th>
                  <th className="py-2.5 px-2">Customer</th>
                  <th className="py-2.5 px-2">Status</th>
                  <th className="py-2.5 px-2">ETA</th>
                  <th className="py-2.5 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {recentShipments?.map((s: any) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-2 font-bold text-slate-900">{s.trackingNo}</td>
                    <td className="py-3 px-2 font-medium text-slate-500">{s.orderId}</td>
                    <td className="py-3 px-2 font-semibold text-slate-800">{s.customer}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-block ${
                        s.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                        s.status === 'DELAYED' ? 'bg-rose-100 text-rose-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-slate-500">{s.eta}</td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => router.push(`/tracking?search=${s.trackingNo}`)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Tracking Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delayed Shipments Table - 3 cols */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm lg:col-span-3 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Delayed Shipments</h3>
            <Link href="/shipments?status=DELAYED" className="text-xs font-semibold text-blue-600 hover:text-blue-700">View All</Link>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-2">Tracking No.</th>
                  <th className="py-2.5 px-2">Days Delayed</th>
                  <th className="py-2.5 px-2">Current Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {delayedShipments?.map((s: any) => (
                  <tr
                    key={s.id}
                    onClick={() => router.push(`/tracking?search=${s.trackingNo}`)}
                    className="hover:bg-rose-50/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-2 font-bold text-slate-900">{s.trackingNo}</td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                        {s.daysDelayed}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-slate-600 font-medium">{s.currentLocation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Shipments Map Card - 4 cols */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm lg:col-span-4 flex flex-col hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-slate-900">Live Shipments Map</h3>
            <Link href="/tracking/live-map" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
              View All
            </Link>
          </div>
          <div className="flex-1 min-h-[220px]">
            <LiveShipmentsMap
              isDashboardCard={true}
              onNavigateToLiveMap={() => router.push('/tracking/live-map')}
            />
          </div>
        </div>
      </div>

      {/* BOTTOM ROW 2 (2 Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Tracking Events Table - 7 cols */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm lg:col-span-7 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Recent Tracking Events</h3>
            <Link href="/tracking/events" className="text-xs font-semibold text-blue-600 hover:text-blue-700">View All</Link>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-2">Time</th>
                  <th className="py-2.5 px-2">Tracking No.</th>
                  <th className="py-2.5 px-2">Event</th>
                  <th className="py-2.5 px-2">Location</th>
                  <th className="py-2.5 px-2">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {trackingEvents?.map((e: any) => (
                  <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-2 text-slate-500 font-mono text-[11px]">{e.timestamp}</td>
                    <td className="py-3 px-2 font-bold text-slate-900">{e.tracking_no}</td>
                    <td className="py-3 px-2 font-semibold text-slate-800 flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-blue-500" />
                      {e.event_type}
                    </td>
                    <td className="py-3 px-2 text-slate-600">{e.location}</td>
                    <td className="py-3 px-2 text-slate-500 text-[11px] font-medium">{e.source_device}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Alerts - 5 cols */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm lg:col-span-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">System Alerts</h3>
            <span className="text-xs font-semibold text-slate-400">Live Diagnostics</span>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto max-h-72">
            {alerts?.map((alt: any) => (
              <div
                key={alt.id}
                onClick={() => router.push(alt.targetUrl)}
                className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50/80 transition-all cursor-pointer flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg mt-0.5 ${
                    alt.severity === 'HIGH' ? 'bg-rose-100 text-rose-600' :
                    alt.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{alt.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{alt.message}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">{alt.timestamp}</span>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  alt.severity === 'HIGH' ? 'bg-rose-100 text-rose-700' :
                  alt.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {alt.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
