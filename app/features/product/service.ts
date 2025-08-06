import prisma from '~/lib/prisma';
import type { ProductInputs } from './schema';

export const productService = {
  async getAllProducts(userId: string) {
    return await prisma.product.findMany({
      where: { userId },
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
      orderBy: { createdAt: 'desc' },
    });
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

          // Link variant to option values (this would need to be handled in the UI)
          // For now, we'll skip the option value linking as it requires more complex logic
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
