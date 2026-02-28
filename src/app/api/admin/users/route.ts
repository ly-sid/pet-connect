import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                username: true,
                role: true,
                createdAt: true,
            }
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error('Failed to fetch users:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const userAuth = await getUserFromReq(req);
        if (!userAuth || userAuth.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { email, username, password, name, role } = body;

        if (!email || !username || !password || !name || !role) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if user exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username }
                ]
            }
        });

        if (existingUser) {
            const field = existingUser.email === email ? 'Email' : 'Username';
            return NextResponse.json({ error: `${field} already exists` }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await prisma.user.create({
            data: {
                email,
                username,
                name,
                password: hashedPassword,
                role,
            },
            select: {
                id: true,
                name: true,
                email: true,
                username: true,
                role: true,
                createdAt: true,
            }
        });

        return NextResponse.json({ user: newUser }, { status: 201 });
    } catch (error: any) {
        console.error('Failed to create user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
