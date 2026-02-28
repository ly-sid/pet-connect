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

        const { animalId } = await req.json();
        if (!animalId) return NextResponse.json({ error: 'Missing animal ID' }, { status: 400 });

        // check if already favorited
        const existingUser = await prisma.user.findUnique({
            where: { id: user.id },
            include: { favoriteAnimals: { where: { id: animalId } } }
        });

        const isFavorited = existingUser?.favoriteAnimals && existingUser.favoriteAnimals.length > 0;

        if (isFavorited) {
            // unfavorite
            await prisma.user.update({
                where: { id: user.id },
                data: { favoriteAnimals: { disconnect: { id: animalId } } }
            });
            return NextResponse.json({ favorited: false });
        } else {
            // favorite
            await prisma.user.update({
                where: { id: user.id },
                data: { favoriteAnimals: { connect: { id: animalId } } }
            });
            return NextResponse.json({ favorited: true });
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const userAuth = await getUserFromReq(req);
        if (!userAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const user = await prisma.user.findUnique({
            where: { id: userAuth.id },
            include: { favoriteAnimals: true }
        });

        return NextResponse.json(user?.favoriteAnimals || []);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
