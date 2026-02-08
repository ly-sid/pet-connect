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

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getUserFromReq(req);
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { status } = body;

        const request = await prisma.adoptionRequest.update({
            where: { id: params.id },
            data: { status },
            include: { animal: true }
        });

        // If approved, update animal status
        if (status === 'APPROVED') {
            await prisma.animal.update({
                where: { id: request.animalId },
                data: { status: 'ADOPTED' }
            });
        }

        return NextResponse.json(request);
    } catch (error) {
        console.error('Error updating adoption request:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
