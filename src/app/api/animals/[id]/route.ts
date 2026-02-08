import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const animal = await prisma.animal.findUnique({
            where: { id: params.id },
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
    { params }: { params: { id: string } }
) {
    try {
        const body = await req.json();
        const animal = await prisma.animal.update({
            where: { id: params.id },
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
    { params }: { params: { id: string } }
) {
    try {
        await prisma.animal.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ message: 'Animal deleted' });
    } catch (error) {
        console.error('Error deleting animal:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
