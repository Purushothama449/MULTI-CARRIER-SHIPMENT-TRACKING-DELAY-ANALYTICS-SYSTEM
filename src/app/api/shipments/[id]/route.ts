import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const shipment = await dbStore.getShipmentById(params.id);
    if (!shipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
    }
    return NextResponse.json({ shipment });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { currentStatus, currentLocation, delayDays } = body;

    const updated = await dbStore.updateShipmentStatus(params.id, currentStatus, currentLocation, delayDays);
    if (!updated) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
    }

    // Also record tracking event in MongoDB log
    await dbStore.addTrackingEvent({
      shipment_id: params.id,
      tracking_no: updated.trackingNo,
      event_type: currentStatus,
      location: currentLocation,
      latitude: 12.9716,
      longitude: 77.5946,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source_device: 'Dispatch Admin',
      remarks: `Status updated to ${currentStatus} at ${currentLocation}`
    });

    return NextResponse.json({ success: true, shipment: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbStore.deleteShipment(params.id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
