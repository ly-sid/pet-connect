
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const view = searchParams.get('view');

        const query: any = {
            orderBy: { createdAt: 'desc' }
        };

        if (view === 'public') {
            query.where = {
                stock: { gt: 0 }
            };
        }

        const products = await prisma.product.findMany(query);
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, price, image } = body;

        if (!name || !price || !image) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name,
                price: parseFloat(price),
                stock: parseInt(body.stock || '0'),
                image
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
