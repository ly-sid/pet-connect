
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { items } = body; // Expecting { items: [{ id: 1, quantity: 1 }] }

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: 'Invalid items data' }, { status: 400 });
        }

        // Transaction to ensure atomicity
        const result = await prisma.$transaction(async (tx) => {
            const results = [];

            for (const item of items) {
                const product = await tx.product.findUnique({
                    where: { id: item.id }
                });

                if (!product) {
                    throw new Error(`Product with ID ${item.id} not found`);
                }

                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for product: ${product.name}`);
                }

                const updatedProduct = await tx.product.update({
                    where: { id: item.id },
                    data: {
                        stock: product.stock - item.quantity
                    }
                });
                results.push(updatedProduct);
            }

            return results;
        });

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        console.error('Purchase Transaction Error:', error);
        return NextResponse.json({ error: error.message || 'Transaction failed' }, { status: 400 });
    }
}
