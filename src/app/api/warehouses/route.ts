import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db';
import { z } from 'zod';

const warehouseSchema = z.object({
  name: z.string().min(2),
  location: z.string(),
  city: z.string(),
  state: z.string(),
  capacity: z.number().positive(),
  currentUtilization: z.number().nonnegative(),
  managerName: z.string()
});

export async function GET() {
  try {
    const warehouses = await dbStore.getWarehouses();
    return NextResponse.json({ warehouses });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = warehouseSchema.parse(body);
    const created = await dbStore.createWarehouse({
      name: parsed.name,
      location: parsed.location,
      city: parsed.city,
      state: parsed.state,
      capacity: parsed.capacity,
      currentUtilization: parsed.currentUtilization,
      managerName: parsed.managerName
    });
    return NextResponse.json({ success: true, warehouse: created });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
