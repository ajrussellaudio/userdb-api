import { Prisma } from '@prisma/client';
import request from 'supertest';
import express, { Express } from 'express';
import UserController from './UserController';
import prismaMock from '../../tests/mock-prisma';

const app: Express = express();

function generatePassword(length: number, charSet = 'Abc123') {
  return Array.from({ length })
    .map((_, i) => charSet[i % charSet.length])
    .join('');
}

const VALID_USER_INPUT: Prisma.UserCreateInput = {
  name: 'Bruce Wayne',
  email: 'batman@justiceleague.com',
  password: generatePassword(8),
  type: 'PRIVATE_TUTOR',
};

describe('UserController', () => {
  beforeAll(() => {
    app.use(express.json());
    app.use('/users', UserController);
  });

  it('responds with a successfully created user', (done) => {
    prismaMock.user.create.mockResolvedValueOnce({
      ...VALID_USER_INPUT,
      id: 3,
      createdAt: new Date(0),
    });
    request(app)
      .post('/users')
      .send(VALID_USER_INPUT)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201, {
        ...VALID_USER_INPUT,
        id: 3,
        createdAt: new Date(0).toISOString(),
      })
      .end(done);
  });

  it('rejects a missing name', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        ...VALID_USER_INPUT,
        name: undefined,
      })
      .set('Accept', 'application/json');

    expect(response.status).toEqual(422);
    expect(response.body.error.fieldErrors.name[0]).toEqual('Required');
  });

  it('rejects a missing email', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        ...VALID_USER_INPUT,
        email: undefined,
      })
      .set('Accept', 'application/json');

    expect(response.status).toEqual(422);
    expect(response.body.error.fieldErrors.email[0]).toEqual('Required');
  });

  it('rejects a missing user type', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        ...VALID_USER_INPUT,
        type: undefined,
      })
      .set('Accept', 'application/json');

    expect(response.status).toEqual(422);
    expect(response.body.error.fieldErrors.type[0]).toEqual('Invalid input');
  });

  it('rejects an invalid user type', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        ...VALID_USER_INPUT,
        type: 'CAPED_CRUSADER',
      })
      .set('Accept', 'application/json');

    expect(response.status).toEqual(422);
    expect(response.body.error.fieldErrors.type[0]).toEqual('Invalid input');
  });

  it('rejects a missing password', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        ...VALID_USER_INPUT,
        password: undefined,
      })
      .set('Accept', 'application/json');

    expect(response.status).toEqual(422);
    expect(response.body.error.fieldErrors.password[0]).toEqual('Required');
  });

  it('rejects a password too short', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        ...VALID_USER_INPUT,
        password: generatePassword(7),
      })
      .set('Accept', 'application/json');

    expect(response.status).toEqual(422);
    expect(response.body.error.fieldErrors.password[0]).toEqual(
      'Must be 8 characters or more',
    );
  });

  it('rejects a password too long', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        ...VALID_USER_INPUT,
        password: generatePassword(65),
      })
      .set('Accept', 'application/json');

    expect(response.status).toEqual(422);
    expect(response.body.error.fieldErrors.password[0]).toEqual(
      'Must be 64 characters or less',
    );
  });

  it('rejects a password with no digits', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        ...VALID_USER_INPUT,
        password: generatePassword(8, 'ABCdef'),
      })
      .set('Accept', 'application/json');

    expect(response.status).toEqual(422);
    expect(response.body.error.fieldErrors.password[0]).toEqual(
      'Must contain at least one digit (0-9)',
    );
  });

  it('rejects a password with no lowercase letters', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        ...VALID_USER_INPUT,
        password: generatePassword(8, 'ABC123'),
      })
      .set('Accept', 'application/json');

    expect(response.status).toEqual(422);
    expect(response.body.error.fieldErrors.password[0]).toEqual(
      'Must contain at least one lowercase letter (a-z)',
    );
  });

  it('rejects a password with no uppercase letters', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        ...VALID_USER_INPUT,
        password: generatePassword(8, 'abc123'),
      })
      .set('Accept', 'application/json');

    expect(response.status).toEqual(422);
    expect(response.body.error.fieldErrors.password[0]).toEqual(
      'Must contain at least one uppercase letter (A-Z)',
    );
  });
});
