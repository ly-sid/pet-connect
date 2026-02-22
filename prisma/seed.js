const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('petconnect_777', 10);


    const admins = [
        { username: 'admin_sid', email: 'admin@petconnect.com', name: 'Sidharth' },
        { username: 'admin_asw', email: 'aswini@petconnect.com', name: 'Aswini' },
        { username: 'admin_shi', email: 'shifana@petconnect.com', name: 'Shifana' },
        { username: 'admin_pre', email: 'preethi@petconnect.com', name: 'Preethi' },
    ];


    for (const member of admins) {

        await prisma.user.upsert({
            where: { username: member.username },
            update: {
                name: member.name,
                password: hashedPassword,
            },
            create: {
                username: member.username,
                email: member.email,
                name: member.name,
                password: hashedPassword,
                role: 'ADMIN',
            },
        });

    }

    console.log('Admin accounts created for team members.');

    // Add some sample pets
    const pets = [
        {
            id: '7f643e02-1586-4638-8546-5f654a077c7c',
            name: 'Buddy',
            species: 'Dog',
            breed: 'Golden Retriever',
            age: 2,
            gender: 'Male',
            location: 'Mumbai Rescue Center',
            description: 'Buddy is a friendly Golden Retriever who loves to play fetch and is great with kids.',
            fee: 1500,
            images: ['https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=800']
        },
        {
            id: '8c7b6a4a-2e11-4516-928d-1f6b57d6226f',
            name: 'Whiskers',
            species: 'Cat',
            breed: 'Indie Cat',
            age: 1,
            gender: 'Female',
            location: 'Navi Mumbai Hub',
            description: 'Whiskers is a calm and affectionate cat looking for a quiet home.',
            fee: 500,
            images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800']
        }
    ];

    for (const pet of pets) {
        await prisma.animal.upsert({
            where: { id: pet.id },
            update: pet,
            create: pet
        });
    }

    console.log('Sample pets added.');

}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
