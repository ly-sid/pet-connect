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
