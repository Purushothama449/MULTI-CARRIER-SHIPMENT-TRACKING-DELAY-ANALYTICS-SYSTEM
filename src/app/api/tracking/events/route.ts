import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db';
import { z } from 'zod';

const createEventSchema = z.object({
  shipment_id: z.string(),
  tracking_no: z.string(),
  event_type: z.string(),
  location: z.string(),
  latitude: z.number().default(12.9716),
  longitude: z.number().default(77.5946),
  source_device: z.string().default('System Terminal'),
  remarks: z.string().default('Event logged')
});

export async function GET() {
  try {
    const events = await dbStore.getTrackingEvents();
    return NextResponse.json({ events });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createEventSchema.parse(body);

    const created = await dbStore.addTrackingEvent({
      shipment_id: parsed.shipment_id,
      tracking_no: parsed.tracking_no,
      event_type: parsed.event_type,
      location: parsed.location,
      latitude: parsed.latitude ?? 12.9716,
      longitude: parsed.longitude ?? 77.5946,
      source_device: parsed.source_device ?? 'System Terminal',
      remarks: parsed.remarks ?? 'Event logged',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    return NextResponse.json({ success: true, event: created });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
