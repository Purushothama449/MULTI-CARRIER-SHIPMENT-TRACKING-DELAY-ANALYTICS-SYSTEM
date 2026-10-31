import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db';
import { z } from 'zod';

const createShipmentSchema = z.object({
  trackingNo: z.string().min(3),
  orderId: z.string(),
  orderNumber: z.string().optional(),
  carrierId: z.string(),
  carrierName: z.string(),
  originWarehouseId: z.string(),
  originWarehouseName: z.string(),
  destWarehouseId: z.string().optional(),
  destWarehouseName: z.string().optional(),
  customerName: z.string().min(1),
  destinationCity: z.string().min(1),
  expectedDelivery: z.string(),
  currentStatus: z.enum(['PENDING', 'CONFIRMED', 'PICKED_UP', 'IN_TRANSIT', 'AT_HUB', 'OUT_FOR_DELIVERY', 'DELIVERED', 'DELAYED', 'CANCELLED']).default('PENDING'),
  currentLocation: z.string().min(1),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;
    const carrierId = searchParams.get('carrierId') || undefined;

    const shipments = await dbStore.getShipments({ status, search, carrierId });
    return NextResponse.json({ shipments });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createShipmentSchema.parse(body);

    const created = await dbStore.createShipment({
      trackingNo: parsed.trackingNo,
      orderId: parsed.orderId,
      orderNumber: parsed.orderNumber || 'ORD' + Math.floor(1000 + Math.random() * 9000),
      carrierId: parsed.carrierId,
      carrierName: parsed.carrierName,
      originWarehouseId: parsed.originWarehouseId,
      originWarehouseName: parsed.originWarehouseName,
      destWarehouseId: parsed.destWarehouseId,
      destWarehouseName: parsed.destWarehouseName,
      customerName: parsed.customerName,
      destinationCity: parsed.destinationCity,
      expectedDelivery: parsed.expectedDelivery,
      currentStatus: parsed.currentStatus,
      delayDays: parsed.currentStatus === 'DELAYED' ? 2 : 0,
      currentLocation: parsed.currentLocation,
      routeLegs: [
        {
          id: `leg-${Date.now()}`,
          sequenceNumber: 1,
          fromLocation: parsed.originWarehouseName,
          toLocation: parsed.currentLocation,
          status: 'IN_PROGRESS'
        }
      ]
    });

    return NextResponse.json({ success: true, shipment: created });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create shipment' }, { status: 400 });
  }
}
