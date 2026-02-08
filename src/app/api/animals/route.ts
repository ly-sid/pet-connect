import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const species = searchParams.get('species');
        const status = searchParams.get('status');

        const where: any = {};
        if (species && species !== 'All') where.species = species;
        if (status) where.status = status;

        const animals = await prisma.animal.findMany({
            where,
            include: {
                medicalRecords: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(animals);
    } catch (error) {
        console.error('Error fetching animals:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, species, breed, age, gender, location, description, fee, images } = body;

        if (!name || !species || !breed) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const animal = await prisma.animal.create({
            data: {
                name,
                species,
                breed,
                age: parseInt(age, 10) || 0,
                gender,
                location,
                description,
                fee: parseFloat(fee) || 0,
                images: images || [],
                status: 'AVAILABLE'
            }
        });

        return NextResponse.json(animal, { status: 201 });
    } catch (error) {
        console.error('Error creating animal:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
