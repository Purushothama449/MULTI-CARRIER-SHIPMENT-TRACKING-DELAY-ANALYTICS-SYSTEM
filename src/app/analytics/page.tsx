'use client';

import React from 'react';
import AppLayoutWrapper from '@/components/AppLayoutWrapper';
import { BarChart3, TrendingUp, Clock, AlertTriangle, CheckCircle2, Truck } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';

export default function AnalyticsPage() {
  const carrierComparisonData = [
    { name: 'BlueDart', OnTime: 92, Delay: 8 },
    { name: 'Delhivery', OnTime: 86, Delay: 14 },
    { name: 'FedEx', OnTime: 81, Delay: 19 },
    { name: 'DTDC', OnTime: 78, Delay: 22 },
    { name: 'Ecom Exp', OnTime: 69, Delay: 31 },
  ];

  const monthlyDelayData = [
    { month: 'May', AvgDelay: 1.2 },
    { month: 'Jun', AvgDelay: 1.8 },
    { month: 'Jul', AvgDelay: 1.4 },
    { month: 'Aug', AvgDelay: 2.1 },
    { month: 'Sep', AvgDelay: 1.6 },
    { month: 'Oct', AvgDelay: 1.1 },
  ];

  return (
    <AppLayoutWrapper>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-blue-600" /> Advanced Delay & Performance Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Statistical aggregation of multi-carrier delivery speeds, delay bottlenecks, and hub efficiency
          </p>
        </div>

        {/* Analytics Summary KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400">Avg Delivery Speed</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">2.4 Days</p>
              <span className="text-[10px] text-emerald-600 font-bold">↑ 0.5d faster than last Qtr</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400">Overall On-Time Rate</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">84.2%</p>
              <span className="text-[10px] text-emerald-600 font-bold">↑ 3.1% improvement</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400">Delay Incident Rate</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">10.1%</p>
              <span className="text-[10px] text-rose-600 font-bold">↓ 1.4% reduction</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400">Top Carrier Partner</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">BlueDart</p>
              <span className="text-[10px] text-blue-600 font-bold">92% On-Time SLA</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Truck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Carrier On-Time vs Delay Bar Chart - 7 cols */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-7">
            <h3 className="text-base font-bold text-slate-900 mb-4">Carrier Performance Comparison (%)</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={carrierComparisonData}>
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '12px' }} />
                  <Bar dataKey="OnTime" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Delay" fill="#EF4444" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Delay Trend Line Chart - 5 cols */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-5">
            <h3 className="text-base font-bold text-slate-900 mb-4">Average Delay Duration Trend (Days)</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyDelayData}>
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '12px' }} />
                  <Line type="monotone" dataKey="AvgDelay" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </AppLayoutWrapper>
  );
}
