
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const product = await prisma.product.findUnique({
            where: { id }
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const id = parseInt(params.id);
        const body = await request.json();
        const { name, price, image, stock } = body;

        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const product = await prisma.product.update({
            where: { id },
            data: {
                name,
                price: parseFloat(price),
                image,
                stock: parseInt(stock)
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const product = await prisma.product.findUnique({
            where: { id }
        });

        if (product) {
            // Notify Admins (Non-blocking)
            try {
                const admins = await prisma.user.findMany({
                    where: { role: 'ADMIN' }
                });

                await Promise.all(admins.map(admin =>
                    prisma.notification.create({
                        data: {
                            userId: admin.id,
                            title: 'Product Deleted',
                            message: `Product "${product.name}" has been removed from the marketplace.`,
                            type: 'info'
                        }
                    })
                ));
            } catch (notifyError) {
                console.error('Failed to send notifications:', notifyError);
                // Continue with deletion even if notifications fail
            }

            // Delete product
            await prisma.product.delete({
                where: { id }
            });
        } else {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE Product Error:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
