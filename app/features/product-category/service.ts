import prisma from '~/lib/prisma';
import type { ProductCategoryInputs } from './schema';

export const productCategoryService = {
  async getAllProductCategories(userId: string) {
    return await prisma.productCategory.findMany({
      where: { userId },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  },

  async getProductCategoryById(id: string, userId: string) {
    return await prisma.productCategory.findFirst({
      where: { id, userId },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });
  },

  async createProductCategory(data: ProductCategoryInputs, userId: string) {
    return await prisma.productCategory.create({
      data: {
        ...data,
        userId,
      },
    });
  },

  async updateProductCategory(
    id: string,
    data: ProductCategoryInputs,
    userId: string
  ) {
    return await prisma.productCategory.update({
      where: { id, userId },
      data,
    });
  },

  async deleteProductCategory(id: string, userId: string) {
    const categoryWithProducts = await prisma.productCategory.findFirst({
      where: { id, userId },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (categoryWithProducts && categoryWithProducts._count.products > 0) {
      throw new Error('Cannot delete category with existing products');
    }

    return await prisma.productCategory.delete({
      where: { id, userId },
    });
  },
};
