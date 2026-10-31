'use client';

import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

interface ShipmentMarkerData {
  shipmentId: string;
  trackingNo: string;
  orderId: string;
  customerName: string;
  latitude: number;
  longitude: number;
  status: string;
  carrier: string;
  currentLocation: string;
  originCity: string;
  destCity: string;
  originCoords: [number, number];
  destCoords: [number, number];
  eta: string;
  delayDays: number;
  lastUpdated: string;
}

interface LiveShipmentsMapProps {
  shipmentsData?: ShipmentMarkerData[];
  selectedTrackingNo?: string;
  filterStatus?: string;
  height?: string;
  autoRefresh?: boolean;
  onNavigateToLiveMap?: () => void;
  isDashboardCard?: boolean;
}

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);
const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
);
const ZoomControl = dynamic(
  () => import('react-leaflet').then((mod) => mod.ZoomControl),
  { ssr: false }
);

function MapFlyTo({ selectedShipment, L }: { selectedShipment?: ShipmentMarkerData; L: any }) {
  const { useMap } = require('react-leaflet');
  const map = useMap();

  useEffect(() => {
    if (selectedShipment && map) {
      map.flyTo([selectedShipment.latitude, selectedShipment.longitude], 7, {
        animate: true,
        duration: 1.5
      });
    }
  }, [selectedShipment, map]);

  return null;
}

export default function LiveShipmentsMap({
  shipmentsData,
  selectedTrackingNo,
  filterStatus = 'ALL',
  height = '100%',
  autoRefresh = false,
  onNavigateToLiveMap,
  isDashboardCard = false
}: LiveShipmentsMapProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [L, setL] = useState<any>(null);
  const [shipments, setShipments] = useState<ShipmentMarkerData[]>(shipmentsData || []);

  useEffect(() => {
    setIsMounted(true);
    import('leaflet').then((leaflet) => {
      delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
      setL(leaflet);
    });
  }, []);

  // Fetch live tracking API if shipmentsData not passed directly
  useEffect(() => {
    if (shipmentsData) {
      setShipments(shipmentsData);
      return;
    }

    async function fetchLiveTracking() {
      try {
        const res = await fetch(`/api/tracking/live?status=${encodeURIComponent(filterStatus)}`);
        const json = await res.json();
        if (json.shipments) {
          setShipments(json.shipments);
        }
      } catch (err) {
        console.error('Error fetching live tracking API:', err);
      }
    }

    fetchLiveTracking();

    if (autoRefresh) {
      const interval = setInterval(fetchLiveTracking, 30000);
      return () => clearInterval(interval);
    }
  }, [shipmentsData, filterStatus, autoRefresh]);

  if (!isMounted || !L) {
    return (
      <div className="w-full h-full min-h-[240px] bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-xs text-slate-400 font-medium">
        Loading Interactive Leaflet Map...
      </div>
    );
  }

  // Filter shipments based on prop
  const filteredShipments = shipments.filter(s => {
    if (filterStatus === 'ALL') return true;
    return s.status.toUpperCase() === filterStatus.toUpperCase();
  });

  const selectedShipment = shipments.find(s => s.trackingNo.toUpperCase() === selectedTrackingNo?.toUpperCase());

  // Create custom marker icons based on shipment status
  const getCustomMarkerIcon = (status: string) => {
    let color = '#3B82F6'; // Default Blue (In Transit)
    if (status === 'DELIVERED') color = '#10B981'; // Green
    else if (status === 'DELAYED') color = '#EF4444'; // Red
    else if (status === 'AT_HUB') color = '#8B5CF6'; // Purple
    else if (status === 'OUT_FOR_DELIVERY') color = '#F59E0B'; // Amber

    const svgHtml = `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        border: 3px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="1" y="3" width="15" height="13"></rect>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
          <circle cx="5.5" cy="18.5" r="2.5"></circle>
          <circle cx="18.5" cy="18.5" r="2.5"></circle>
        </svg>
      </div>
    `;

    return L.divIcon({
      html: svgHtml,
      className: 'custom-leaflet-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    });
  };

  const getRouteColor = (status: string) => {
    if (status === 'DELIVERED') return '#10B981';
    if (status === 'DELAYED') return '#EF4444';
    if (status === 'OUT_FOR_DELIVERY') return '#F59E0B';
    return '#3B82F6';
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (isDashboardCard && onNavigateToLiveMap) {
      onNavigateToLiveMap();
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`w-full h-full relative rounded-xl overflow-hidden shadow-inner group ${
        isDashboardCard ? 'cursor-pointer hover:shadow-lg transition-shadow duration-300' : ''
      }`}
      style={{ minHeight: '240px', height }}
    >
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        zoomControl={false}
        scrollWheelZoom={!isDashboardCard}
        dragging={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ZoomControl position="bottomright" />

        {selectedShipment && <MapFlyTo selectedShipment={selectedShipment} L={L} />}

        {/* Route Lines */}
        {filteredShipments.map((s) => (
          <React.Fragment key={`route-${s.shipmentId}`}>
            {s.originCoords && s.destCoords && (
              <Polyline
                positions={[s.originCoords, [s.latitude, s.longitude], s.destCoords]}
                pathOptions={{
                  color: getRouteColor(s.status),
                  weight: 3.5,
                  dashArray: s.status === 'DELIVERED' ? undefined : '6, 6',
                  opacity: 0.8
                }}
              />
            )}
          </React.Fragment>
        ))}

        {/* Active Shipment Markers */}
        {filteredShipments.map((s) => (
          <Marker
            key={s.shipmentId}
            position={[s.latitude, s.longitude]}
            icon={getCustomMarkerIcon(s.status)}
            eventHandlers={{
              click: (e) => {
                // STOP PROPAGATION so dashboard card navigation is NOT triggered on marker click!
                if (e.originalEvent) {
                  e.originalEvent.stopPropagation();
                }
              }
            }}
          >
            <Popup className="custom-leaflet-popup">
              <div
                onClick={(e) => e.stopPropagation()}
                className="p-1 min-w-[200px] text-slate-900 font-sans"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
                  <span className="text-sm font-extrabold text-blue-600">{s.trackingNo}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    s.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                    s.status === 'DELAYED' ? 'bg-rose-100 text-rose-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {s.status}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="font-semibold text-slate-800">
                    Carrier: <span className="font-bold text-slate-900">{s.carrier}</span>
                  </div>
                  <div className="text-slate-600 font-medium">
                    📍 Current Location: <span className="font-bold text-slate-900">{s.currentLocation}</span>
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Last Updated: <span className="font-semibold">{s.lastUpdated}</span>
                  </div>
                  <div className="text-slate-600 font-medium">
                    ETA: <span className="font-bold text-slate-900">{s.eta}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/shipments/${s.shipmentId}`);
                  }}
                  className="mt-3 w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all text-center block"
                >
                  View Shipment
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
