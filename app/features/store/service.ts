import prisma from '~/lib/prisma';
import type { StoreInputs } from './schema';

export const storeService = {
  async getStore(userId: string) {
    return await prisma.store.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getStoreById(id: string, userId: string) {
    return await prisma.store.findFirst({
      where: { id, userId },
    });
  },

  async createStore(data: StoreInputs, userId: string) {
    return await prisma.store.create({
      data: {
        ...data,
        userId,
      },
    });
  },

  async updateStore(id: string, data: StoreInputs, userId: string) {
    return await prisma.store.update({
      where: { id, userId },
      data,
    });
  },

  async deleteStore(id: string, userId: string) {
    return await prisma.store.delete({
      where: { id, userId },
    });
  },
};