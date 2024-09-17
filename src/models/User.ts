/* eslint-disable import/prefer-default-export */
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import prisma from '../../prisma/client';

const UserCreateInput = z.object({
  name: z.string(),
  email: z.string(),
  type: z.union(
    [
      z.literal('TEACHER'),
      z.literal('STUDENT'),
      z.literal('PARENT'),
      z.literal('PRIVATE_TUTOR'),
    ],
    { message: 'Invalid user type' },
  ),
  password: z
    .string()
    .min(8, { message: 'Must be 8 characters or more' })
    .max(64, { message: 'Must be 64 characters or less' })
    .regex(/\d/, { message: 'Must contain at least one digit (0-9)' })
    .regex(/[a-z]/, {
      message: 'Must contain at least one lowercase letter (a-z)',
    })
    .regex(/[A-Z]/, {
      message: 'Must contain at least one uppercase letter (A-Z)',
    }),
});

export async function createUser(input: Prisma.UserCreateInput) {
  const { success, data, error } = UserCreateInput.safeParse(input);
  if (!success) {
    throw error;
  }
  return prisma.user.create({ data });
}
