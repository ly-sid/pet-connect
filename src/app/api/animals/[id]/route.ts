import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const animal = await prisma.animal.findUnique({
            where: { id },
            include: {
                medicalRecords: true,
            }
        });

        if (!animal) {
            return NextResponse.json({ error: 'Animal not found' }, { status: 404 });
        }

        return NextResponse.json(animal);
    } catch (error) {
        console.error('Error fetching animal:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const animal = await prisma.animal.update({
            where: { id },
            data: body
        });

        return NextResponse.json(animal);
    } catch (error) {
        console.error('Error updating animal:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.animal.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Animal deleted' });
    } catch (error) {
        console.error('Error deleting animal:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
