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

// POST /api/rescue-requests - Submit a new rescue request
export async function POST(req: Request) {
    try {
        const user = await getUserFromReq(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { petName, species, breed, location, description } = body;

        const rescueRequest = await prisma.rescueRequest.create({
            data: {
                userId: user.id,
                petName: petName || "Unknown",
                species,
                breed,
                location,
                description,
                status: 'PENDING'
            }
        });

        return NextResponse.json(rescueRequest, { status: 201 });
    } catch (error) {
        console.error('Error creating rescue request:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// GET /api/rescue-requests - Get all requests (User sees theirs, ADMIN/RESCUE sees all)
export async function GET(req: Request) {
    try {
        const user = await getUserFromReq(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let requests;

        if (user.role === 'ADMIN' || user.role === 'RESCUE') {
            requests = await prisma.rescueRequest.findMany({
                include: { user: { select: { name: true, email: true } } },
                orderBy: { createdAt: 'desc' }
            });
        } else {
            requests = await prisma.rescueRequest.findMany({
                where: { userId: user.id },
                orderBy: { createdAt: 'desc' }
            });
        }

        return NextResponse.json(requests);
    } catch (error) {
        console.error('Error fetching rescue requests:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
