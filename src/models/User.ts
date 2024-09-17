/* eslint-disable import/prefer-default-export */
import { Prisma } from '@prisma/client';
import prisma from '../../prisma/client';

export async function createUser(data: Prisma.UserCreateInput) {
  return prisma.user.create({ data });
}
