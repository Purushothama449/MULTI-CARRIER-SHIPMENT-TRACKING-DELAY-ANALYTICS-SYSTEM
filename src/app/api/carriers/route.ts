import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db';
import { z } from 'zod';

const carrierSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2),
  contactPhone: z.string(),
  contactEmail: z.string().email(),
  serviceType: z.string(),
  onTimeRate: z.number().min(0).max(100).default(80),
  status: z.string().default('ACTIVE')
});

export async function GET() {
  try {
    const carriers = await dbStore.getCarriers();
    return NextResponse.json({ carriers });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = carrierSchema.parse(body);
    const created = await dbStore.createCarrier({
      name: parsed.name,
      code: parsed.code,
      contactPhone: parsed.contactPhone,
      contactEmail: parsed.contactEmail,
      serviceType: parsed.serviceType,
      onTimeRate: parsed.onTimeRate ?? 80,
      status: parsed.status ?? 'ACTIVE'
    });
    return NextResponse.json({ success: true, carrier: created });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
