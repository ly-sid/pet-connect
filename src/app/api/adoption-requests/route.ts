import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Helper to get user from cookie
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

        const requests = await prisma.adoptionRequest.findMany({
            where: user.role === 'ADMIN' ? {} : { userId: user.id },
            include: {
                animal: true,
                user: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { applicationDate: 'desc' }
        });

        return NextResponse.json(requests);
    } catch (error) {
        console.error('Error fetching adoption requests:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const user = await getUserFromReq(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { animalId, message } = body;

        if (!animalId || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const request = await prisma.adoptionRequest.create({
            data: {
                animalId,
                userId: user.id,
                message,
                status: 'PENDING'
            }
        });

        return NextResponse.json(request, { status: 201 });
    } catch (error) {
        console.error('Error creating adoption request:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
