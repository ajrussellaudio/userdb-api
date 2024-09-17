import { PrismaClient } from '@prisma/client';

export default new PrismaClient({ omit: { user: { password: true } } });
