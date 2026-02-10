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
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const user = await getUserFromReq(req);
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { status } = body;

        // Fetch the request first to get userId and animal details
        const existingRequest = await prisma.adoptionRequest.findUnique({
            where: { id },
            include: { animal: true, user: true }
        });

        if (!existingRequest) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        const request = await prisma.adoptionRequest.update({
            where: { id },
            data: { status },
            include: { animal: true }
        });

        // Generate Notification
        if (status === 'APPROVED') {
            await prisma.notification.create({
                data: {
                    userId: existingRequest.userId,
                    title: 'Adoption Request Approved! 🎉',
                    message: `Congratulations! Your request to adopt ${existingRequest.animal.name} has been approved. The rescue team will contact you shortly.`,
                    type: 'success'
                }
            });

            // Update animal status
            await prisma.animal.update({
                where: { id: existingRequest.animalId },
                data: { status: 'ADOPTED' }
            });
        } else if (status === 'REJECTED') {
            await prisma.notification.create({
                data: {
                    userId: existingRequest.userId,
                    title: 'Update on Your Adoption Request',
                    message: `We're sorry to inform you that your request to adopt ${existingRequest.animal.name} was not approved at this time.`,
                    type: 'info' // Or 'warning'/error depending on UI preference
                }
            });
        }

        return NextResponse.json(request);
    } catch (error) {
        console.error('Error updating adoption request:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
