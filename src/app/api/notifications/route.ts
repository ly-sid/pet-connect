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

export async function GET(req: Request) {
    try {
        const user = await getUserFromReq(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const notifications = await prisma.notification.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
