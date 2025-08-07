import { PAGINATION } from '~/lib/constants';
import prisma from '~/lib/prisma';
import { getSkip } from '~/lib/utils.server';
import type { ProductInputs } from './schema';

export interface GetAllProductsArgs {
  userId: string;
  page?: number;
  limit?: number;
  search?: string;
}

export const productService = {
  async getAllProducts({
    userId,
    search,
    page = PAGINATION.page,
    limit = PAGINATION.limit,
  }: GetAllProductsArgs) {
    const totalDocs = await prisma.product.count({ where: { userId } });

    const products = await prisma.product.findMany({
      where: { userId, name: { contains: search, mode: 'insensitive' } },
      include: {
        category: true,
        variantOptions: {
          include: {
            values: true,
          },
          orderBy: { position: 'asc' },
        },
        variants: {
          include: {
            optionValues: {
              include: {
                optionValue: {
                  include: {
                    option: true,
                  },
                },
              },
            },
          },
        },
      },
      take: limit,
      skip: getSkip({ limit, page }),
      orderBy: { createdAt: 'desc' },
    });

    return {
      pageInfo: {
        total: totalDocs,
        page,
        limit,
      },
      data: products,
    };
  },

  async getProductById(id: string, userId: string) {
    return await prisma.product.findFirst({
      where: { id, userId },
      include: {
        category: true,
        variantOptions: {
          include: {
            values: {
              orderBy: { position: 'asc' },
            },
          },
          orderBy: { position: 'asc' },
        },
        variants: {
          include: {
            optionValues: {
              include: {
                optionValue: {
                  include: {
                    option: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  },

  async createProduct(data: ProductInputs, userId: string) {
    const { variantOptions, variants, ...productData } = data;

    return await prisma.$transaction(async (tx) => {
      // Create the product first
      const product = await tx.product.create({
        data: {
          ...productData,
          userId,
        },
      });

      // Create variant options if hasVariants is true
      if (data.hasVariants && variantOptions.length > 0) {
        const createdOptions: Record<string, Record<string, string>> = {};

        // Create options and their values
        for (const option of variantOptions) {
          const createdOption = await tx.productVariantOption.create({
            data: {
              productId: product.id,
              name: option.name,
              position: option.position,
            },
          });

          createdOptions[option.name] = {};

          for (const value of option.values) {
            const createdValue = await tx.productVariantOptionValue.create({
              data: {
                optionId: createdOption.id,
                value: value.value,
                position: value.position,
              },
            });

            createdOptions[option.name][value.value] = createdValue.id;
          }
        }

        // Create variants if provided
        for (const variant of variants) {
          await tx.productVariant.create({
            data: {
              productId: product.id,
              title: variant.title,
              sku: variant.sku,
              price: variant.price,
              isDefault: variant.isDefault,
              isAvailable: variant.isAvailable,
            },
          });
        }
      }

      return await tx.product.findUnique({
        where: { id: product.id },
        include: {
          category: true,
          variantOptions: {
            include: {
              values: true,
            },
            orderBy: { position: 'asc' },
          },
          variants: {
            include: {
              optionValues: {
                include: {
                  optionValue: {
                    include: {
                      option: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    });
  },

  async updateProduct(id: string, data: ProductInputs, userId: string) {
    const { variantOptions, variants, ...productData } = data;

    return await prisma.$transaction(async (tx) => {
      // Update the product
      const product = await tx.product.update({
        where: { id, userId },
        data: productData,
      });

      // Clear existing variant options and variants
      await tx.productVariant.deleteMany({
        where: { productId: id },
      });
      await tx.productVariantOption.deleteMany({
        where: { productId: id },
      });

      // Recreate variant options if hasVariants is true
      if (data.hasVariants && variantOptions.length > 0) {
        const createdOptions: Record<string, Record<string, string>> = {};

        for (const option of variantOptions) {
          const createdOption = await tx.productVariantOption.create({
            data: {
              productId: product.id,
              name: option.name,
              position: option.position,
            },
          });

          createdOptions[option.name] = {};

          for (const value of option.values) {
            const createdValue = await tx.productVariantOptionValue.create({
              data: {
                optionId: createdOption.id,
                value: value.value,
                position: value.position,
              },
            });

            createdOptions[option.name][value.value] = createdValue.id;
          }
        }

        // Recreate variants
        for (const variant of variants) {
          await tx.productVariant.create({
            data: {
              productId: product.id,
              title: variant.title,
              sku: variant.sku,
              price: variant.price,
              isDefault: variant.isDefault,
              isAvailable: variant.isAvailable,
            },
          });
        }
      }

      return await tx.product.findUnique({
        where: { id: product.id },
        include: {
          category: true,
          variantOptions: {
            include: {
              values: true,
            },
            orderBy: { position: 'asc' },
          },
          variants: {
            include: {
              optionValues: {
                include: {
                  optionValue: {
                    include: {
                      option: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    });
  },

  async deleteProduct(id: string, userId: string) {
    return await prisma.product.delete({
      where: { id, userId },
    });
  },

  // Helper function to generate all possible variant combinations
  generateVariantCombinations(
    variantOptions: Array<{ name: string; values: Array<{ value: string }> }>
  ) {
    if (variantOptions.length === 0) return [];

    const combinations: Array<{
      title: string;
      options: Record<string, string>;
    }> = [];

    function generateCombos(
      index: number,
      currentCombo: Record<string, string>
    ) {
      if (index === variantOptions.length) {
        const title = Object.values(currentCombo).join(' / ');
        combinations.push({ title, options: { ...currentCombo } });
        return;
      }

      const option = variantOptions[index];
      for (const value of option.values) {
        generateCombos(index + 1, {
          ...currentCombo,
          [option.name]: value.value,
        });
      }
    }

    generateCombos(0, {});
    return combinations;
  },
};

export type ProductData = NonNullable<
  Awaited<ReturnType<typeof productService.getProductById>>
>;
