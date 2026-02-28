const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    console.log('Migrating DONOR users to USER...');
    try {
        await prisma.$executeRaw`UPDATE "User" SET "role" = 'USER' WHERE "role" = 'DONOR';`;
        console.log('Migration complete.');
    } catch (e) {
        console.error('Migration failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
