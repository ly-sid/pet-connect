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

        const stats: any = {};

        if (user.role === 'ADMIN') {
            stats.pendingApprovals = await prisma.adoptionRequest.count({ where: { status: 'PENDING' } });
            stats.totalAnimals = await prisma.animal.count();
            const revenue = await prisma.donation.aggregate({ _sum: { amount: true } });
            stats.platformRevenue = revenue._sum.amount || 0;
        } else if (user.role === 'RESCUE') {
            stats.activeListings = await prisma.animal.count({ where: { status: 'AVAILABLE' } });
            stats.pendingInquiries = await prisma.adoptionRequest.count({ where: { status: 'PENDING' } });
        } else if (user.role === 'USER') {
            stats.myApplications = await prisma.adoptionRequest.count({ where: { userId: user.id } });

            const userWithFavs = await prisma.user.findUnique({
                where: { id: user.id },
                include: { _count: { select: { favoriteAnimals: true } } }
            });
            stats.favorites = userWithFavs?._count?.favoriteAnimals || 0;

            const contribution = await prisma.donation.aggregate({
                where: { userId: user.id },
                _sum: { amount: true },
                _count: { id: true }
            });
            stats.totalContributed = contribution._sum.amount || 0;
            stats.impactCount = contribution._count.id || 0;
        }

        return NextResponse.json(stats);
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
