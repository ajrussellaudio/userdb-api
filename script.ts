// Run this with:
//   npx ts-node script.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedData() {
  await prisma.user.createMany({
    data: [
      {
        name: 'Splinter',
        email: 'splinter@tmnt.com',
        password: 'M4ster5plinter',
        type: 'TEACHER',
      },
      {
        name: 'Leonardo',
        email: 'leo@tmnt.com',
        password: 'IH34rtApril',
        type: 'STUDENT',
      },
      {
        name: 'Donatello',
        email: 'don@tmnt.com',
        password: 'M4ch1nes',
        type: 'STUDENT',
      },
      {
        name: 'Raphael',
        email: 'raph@tmnt.com',
        password: 'c00lButRude',
        type: 'STUDENT',
      },
      {
        name: 'Michelangelo',
        email: 'mikey@tmnt.com',
        password: 'C0wabunga',
        type: 'STUDENT',
      },
    ],
  });
}

async function deleteAll() {
  await prisma.user.deleteMany();
}

async function logAllUsers() {
  const users = await prisma.user.findMany();
  // eslint-disable-next-line no-console
  console.log(users);
}

async function main() {
  await deleteAll();
  await seedData();
  await logAllUsers();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
