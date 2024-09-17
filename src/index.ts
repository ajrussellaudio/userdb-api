import express, { Express } from 'express';
import prisma from '../prisma/client';
import UserController from './controllers/UserController';

const app: Express = express();
const port = process.env.PORT || 3000;

async function main() {
  app.use(express.json());

  app.use('/api/v1/users', UserController);

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}

main()
  .then(async () => {
    await prisma.$connect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
