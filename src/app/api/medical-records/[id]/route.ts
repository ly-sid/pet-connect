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

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getUserFromReq(req);
        if (!user || (user.role !== 'VET' && user.role !== 'ADMIN')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        await prisma.medicalRecord.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Record deleted successfully' });
    } catch (error) {
        console.error('Error deleting medical record:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
