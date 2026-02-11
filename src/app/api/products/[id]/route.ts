
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
            // Notify Admins
            const admins = await prisma.user.findMany({
                where: { role: 'ADMIN' }
            });

            await Promise.all(admins.map(admin =>
                prisma.notification.create({
                    data: {
                        userId: admin.id,
                        title: 'Product Purchased',
                        message: `Product "${product.name}" (₹${product.price}) has been purchased from the marketplace.`,
                        type: 'success'
                    }
                })
            ));

            // Delete product
            await prisma.product.delete({
                where: { id }
            });
        } else {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
