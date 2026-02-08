const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const animals = await prisma.animal.findMany();
    console.log('Animals in DB:', animals);
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
        process.exit(1);
    });
