import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db';
import { z } from 'zod';

const createOrderSchema = z.object({
  orderNumber: z.string().min(2),
  customerId: z.string(),
  customerName: z.string(),
  totalAmount: z.number().positive(),
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']).default('PENDING'),
  itemsCount: z.number().int().positive().default(1),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;

    const orders = await dbStore.getOrders(search, status);
    return NextResponse.json({ orders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createOrderSchema.parse(body);

    const created = await dbStore.createOrder({
      orderNumber: parsed.orderNumber,
      customerId: parsed.customerId,
      customerName: parsed.customerName,
      orderDate: new Date().toISOString(),
      totalAmount: parsed.totalAmount,
      status: parsed.status,
      itemsCount: parsed.itemsCount
    });

    return NextResponse.json({ success: true, order: created });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create order' }, { status: 400 });
  }
}
