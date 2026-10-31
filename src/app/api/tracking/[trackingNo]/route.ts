import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { trackingNo: string } }) {
  try {
    const shipment = await dbStore.getShipmentByTracking(params.trackingNo);
    if (!shipment) {
      return NextResponse.json({ error: 'Tracking number not found' }, { status: 404 });
    }

    const events = await dbStore.getTrackingEvents(params.trackingNo);

    // Standardized timeline steps for visual tracking
    const timeline = [
      { step: 'Order Created', completed: true, date: shipment.createdAt },
      { step: 'Picked Up', completed: ['PICKED_UP', 'IN_TRANSIT', 'AT_HUB', 'OUT_FOR_DELIVERY', 'DELIVERED', 'DELAYED'].includes(shipment.currentStatus), date: '2025-09-25 10:30 AM' },
      { step: `${shipment.originWarehouseName}`, completed: ['IN_TRANSIT', 'AT_HUB', 'OUT_FOR_DELIVERY', 'DELIVERED', 'DELAYED'].includes(shipment.currentStatus), date: '2025-09-25 01:15 PM' },
      { step: `${shipment.currentLocation || 'Transit Hub'}`, completed: ['AT_HUB', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(shipment.currentStatus), date: '2025-09-26 09:00 AM' },
      { step: 'Out for Delivery', completed: ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(shipment.currentStatus), date: '2025-09-27 08:30 AM' },
      { step: 'Delivered', completed: shipment.currentStatus === 'DELIVERED', date: shipment.actualDelivery || 'Pending' }
    ];

    return NextResponse.json({
      shipment,
      events,
      timeline
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
