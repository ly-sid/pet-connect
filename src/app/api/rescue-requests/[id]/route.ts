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

// PATCH /api/rescue-requests/[id] - Update request status (ADMIN/RESCUE only)
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getUserFromReq(req);
        if (!user || (user.role !== 'ADMIN' && user.role !== 'RESCUE')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const { status } = body;

        if (!status || !['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const request = await prisma.rescueRequest.update({
            where: { id },
            data: { status }
        });

        // Optionally, create a notification for the user about the status update
        await prisma.notification.create({
            data: {
                userId: request.userId,
                title: 'Rescue Request Updated',
                message: `Your rescue request for ${request.petName} has been ${status.toLowerCase()}.`,
                type: status === 'APPROVED' ? 'success' : 'warning',
            }
        });

        return NextResponse.json(request);
    } catch (error) {
        console.error('Error updating rescue request:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
