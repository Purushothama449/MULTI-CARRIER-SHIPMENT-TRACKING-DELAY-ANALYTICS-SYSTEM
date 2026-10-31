'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayoutWrapper from '@/components/AppLayoutWrapper';
import { ArrowLeft, Truck, CheckCircle2, Clock, AlertTriangle, MapPin, Building, Calendar, User } from 'lucide-react';
import LiveShipmentsMap from '@/components/LiveShipmentsMap';

export default function ShipmentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [shipment, setShipment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchShipment() {
      try {
        setLoading(true);
        const res = await fetch(`/api/shipments/${params.id}`);
        const json = await res.json();
        setShipment(json.shipment || null);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchShipment();
  }, [params.id]);

  if (loading) {
    return (
      <AppLayoutWrapper>
        <div className="p-8 text-center text-slate-400 font-medium">Loading shipment details...</div>
      </AppLayoutWrapper>
    );
  }

  if (!shipment) {
    return (
      <AppLayoutWrapper>
        <div className="p-8 text-center space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Shipment Record Not Found</h2>
          <button
            onClick={() => router.push('/shipments')}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold text-xs"
          >
            Back to Shipments
          </button>
        </div>
      </AppLayoutWrapper>
    );
  }

  return (
    <AppLayoutWrapper>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/shipments')}
            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors font-semibold text-xs sm:text-sm flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Shipments
          </button>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              Shipment {shipment.trackingNo}
            </h1>
            <p className="text-xs text-slate-500">Order: {shipment.orderNumber}</p>
          </div>
        </div>

        {/* 2 Column Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Shipment Specs & Route Legs - 7 cols */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status Badge</span>
                  <div className="mt-1">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                      shipment.currentStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                      shipment.currentStatus === 'DELAYED' ? 'bg-rose-100 text-rose-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {shipment.currentStatus} {shipment.delayDays > 0 ? `(${shipment.delayDays} Days Delay)` : ''}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-xs font-medium">Expected Delivery</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">
                    {new Date(shipment.expectedDelivery).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Carrier</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{shipment.carrierName}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Customer</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{shipment.customerName}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Origin Hub</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{shipment.originWarehouseName}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Current Location</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{shipment.currentLocation}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Destination City</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{shipment.destinationCity}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Calculated Delay</span>
                  <div className="font-bold text-rose-600 text-sm mt-0.5">{shipment.delayDays} Days</div>
                </div>
              </div>
            </div>

            {/* Route Legs */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">Multi-Leg Route Segments</h3>
              <div className="space-y-3">
                {shipment.routeLegs?.map((leg: any) => (
                  <div key={leg.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 font-semibold text-slate-800">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
                        {leg.sequenceNumber}
                      </span>
                      <span>{leg.fromLocation} $\rightarrow$ {leg.toLocation}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      leg.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {leg.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Route Map - 5 cols */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[520px]">
              <h3 className="text-base font-bold text-slate-900 mb-3">Interactive Live Route Map</h3>
              <div className="flex-1 rounded-xl overflow-hidden">
                <LiveShipmentsMap selectedTrackingNo={shipment.trackingNo} height="100%" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayoutWrapper>
  );
}
