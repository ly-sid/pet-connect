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
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { amount, type, targetRaw, message } = body;

        if (!amount || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const donation = await prisma.donation.create({
            data: {
                userId: user.id,
                amount: parseFloat(amount),
                type,
                targetRaw,
                message
            }
        });

        return NextResponse.json(donation, { status: 201 });
    } catch (error) {
        console.error('Error recording donation:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const user = await getUserFromReq(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const donations = await prisma.donation.findMany({
            where: user.role === 'ADMIN' ? {} : { userId: user.id },
            orderBy: { date: 'desc' }
        });

        return NextResponse.json(donations);
    } catch (error) {
        console.error('Error fetching donations:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
