import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db';
import { getCityCoords } from '@/lib/cities';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'ALL';
    const search = searchParams.get('search') || '';

    const shipments = await dbStore.getShipments();
    const trackingEvents = await dbStore.getTrackingEvents();

    let liveData = shipments.map((s) => {
      // Find latest tracking event for location/coords if available
      const latestEvent = trackingEvents.find(e => e.tracking_no.toUpperCase() === s.trackingNo.toUpperCase());

      let coords = getCityCoords(s.currentLocation);
      if (latestEvent && latestEvent.latitude && latestEvent.longitude) {
        coords = [latestEvent.latitude, latestEvent.longitude];
      }

      const originCoords = getCityCoords(s.originWarehouseName || 'Bangalore');
      const destCoords = getCityCoords(s.destinationCity || 'Mumbai');

      const etaFormatted = s.expectedDelivery
        ? new Date(s.expectedDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'Oct 2, 2025';

      return {
        shipmentId: s.id,
        trackingNo: s.trackingNo,
        orderId: s.orderNumber || s.orderId,
        customerName: s.customerName,
        latitude: coords[0],
        longitude: coords[1],
        status: s.currentStatus,
        carrier: s.carrierName,
        currentLocation: s.currentLocation,
        originCity: s.originWarehouseName,
        destCity: s.destinationCity,
        originCoords,
        destCoords,
        eta: etaFormatted,
        delayDays: s.delayDays || 0,
        lastUpdated: latestEvent ? latestEvent.timestamp : '10:32 AM'
      };
    });

    if (status && status !== 'ALL') {
      liveData = liveData.filter(item => item.status.toUpperCase() === status.toUpperCase());
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      liveData = liveData.filter(item =>
        item.trackingNo.toLowerCase().includes(q) ||
        item.carrier.toLowerCase().includes(q) ||
        item.customerName.toLowerCase().includes(q) ||
        item.currentLocation.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      total: liveData.length,
      shipments: liveData
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
