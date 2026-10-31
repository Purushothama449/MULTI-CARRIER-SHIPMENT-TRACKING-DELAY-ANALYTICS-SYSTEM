'use client';

import React, { useState } from 'react';
import AppLayoutWrapper from '@/components/AppLayoutWrapper';
import { FileText, Download, Printer, Play, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('Shipment Report');
  const [dateFrom, setDateFrom] = useState('2025-09-01');
  const [dateTo, setDateTo] = useState('2025-09-30');
  const [reportResult, setReportResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportType, dateFrom, dateTo })
      });
      const json = await res.json();
      setReportResult(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!reportResult || !reportResult.records || reportResult.records.length === 0) return;
    const records = reportResult.records;
    const headers = Object.keys(records[0]).join(',');
    const rows = records.map((row: any) => Object.values(row).map(val => `"${val}"`).join(','));
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${reportType.replace(/\s+/g, '_')}_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AppLayoutWrapper>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <FileText className="w-7 h-7 text-blue-600" /> Automated Report Generator
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Generate DBMS analytics reports, export CSV datasheets, and produce printable summaries
            </p>
          </div>
        </div>

        {/* Report Configuration Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Select Report Criteria</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Report Category</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-semibold outline-none"
              >
                <option value="Shipment Report">Shipment Report</option>
                <option value="Delayed Shipment Report">Delayed Shipment Report</option>
                <option value="Carrier Performance Report">Carrier Performance Report</option>
                <option value="Warehouse Report">Warehouse Report</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">From Date</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">To Date</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all"
            >
              <Play className="w-4 h-4 fill-current" /> {loading ? 'Querying Database...' : 'Generate Report'}
            </button>

            {reportResult && (
              <>
                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md shadow-emerald-500/20 transition-all"
                >
                  <FileSpreadsheet className="w-4 h-4" /> Export CSV
                </button>

                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all"
                >
                  <Printer className="w-4 h-4" /> Print PDF Report
                </button>
              </>
            )}
          </div>
        </div>

        {/* Report Output View */}
        {reportResult && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{reportResult.reportTitle}</h2>
                <p className="text-xs text-slate-500">Generated on: {new Date(reportResult.generatedAt).toLocaleString()} • {reportResult.totalRecords} records found</p>
              </div>
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Query Execution Success
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500 uppercase">
                    {Object.keys(reportResult.records[0] || {}).map(head => (
                      <th key={head} className="py-2.5 px-3">{head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {reportResult.records.map((rec: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      {Object.values(rec).map((val: any, vIdx) => (
                        <td key={vIdx} className="py-2.5 px-3 font-medium">{String(val)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppLayoutWrapper>
  );
}
