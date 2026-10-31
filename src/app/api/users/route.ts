import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { z } from 'zod';

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  roleName: z.enum(['ADMIN', 'WAREHOUSE_STAFF', 'CARRIER_DRIVER', 'CUSTOMER'])
});

export async function GET() {
  try {
    const users = await dbStore.getUsers();
    return NextResponse.json({ users });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createUserSchema.parse(body);

    const passwordHash = await hashPassword(parsed.password);

    const roleMap: Record<string, string> = {
      ADMIN: 'role-admin',
      WAREHOUSE_STAFF: 'role-staff',
      CARRIER_DRIVER: 'role-driver',
      CUSTOMER: 'role-customer'
    };

    const created = await dbStore.createUser({
      name: parsed.name,
      email: parsed.email,
      passwordHash,
      roleId: roleMap[parsed.roleName] || 'role-customer',
      roleName: parsed.roleName
    });

    return NextResponse.json({ success: true, user: created });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
