import type { Role } from '@prisma/client';

import { prisma } from '../utils/prisma.js';

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(params: {
  email: string;
  name: string;
  passwordHash: string;
  role?: Role;
}) {
  return prisma.user.create({
    data: {
      email: params.email,
      name: params.name,
      passwordHash: params.passwordHash,
      role: params.role ?? 'USER'
    }
  });
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}
