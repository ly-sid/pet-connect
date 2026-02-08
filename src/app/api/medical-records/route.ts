import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

async function getUserFromReq(req: Request) {
    const token = req.headers.get('cookie')?.split('auth-token=')[1]?.split(';')[0];
    if (!token) return null;
    try {
        return jwt.verify(token, JWT_SECRET) as any;
    } catch {
        return null;
    }
}

export async function POST(req: Request) {
    try {
        const user = await getUserFromReq(req);
        if (!user || (user.role !== 'VET' && user.role !== 'ADMIN')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { animalId, diagnosis, treatment, veterinarianName } = body;

        if (!animalId || !diagnosis || !treatment) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const record = await prisma.medicalRecord.create({
            data: {
                animalId,
                diagnosis,
                treatment,
                veterinarianName: veterinarianName || user.name
            }
        });

        return NextResponse.json(record, { status: 201 });
    } catch (error) {
        console.error('Error creating medical record:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
