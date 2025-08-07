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
        variants: true,
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
        variants: true,
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
          variants: true,
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

      console.log('Product updated.');

      // handle variant options if provided
      if (productData.hasVariants && variantOptions?.length > 0) {
        // Get existing variant options (e.g. Size, Temp, etc)
        const existingVariantOptions = await tx.productVariantOption.findMany({
          where: { productId: id },
          include: { values: true },
        });

        const existingOptionsMap = new Map(
          existingVariantOptions.map((opt) => [opt.id, opt])
        );

        const optionsToUpdate = variantOptions.filter((opt) => opt.id); // with id
        const optionsToCreate = variantOptions.filter((opt) => !opt.id); // without id

        const idsOfOptionsToUpdate = optionsToUpdate.map((o) => o.id);

        const optionsToDelete = Array.from(existingOptionsMap.keys()).filter(
          (id) => !idsOfOptionsToUpdate.includes(id)
        );

        // update variant options
        for (const incomingOption of optionsToUpdate) {
          if (incomingOption?.id) {
            const updatedVariantOption = await tx.productVariantOption.update({
              where: { id: incomingOption.id },
              data: {
                position: incomingOption.position,
                name: incomingOption.name,
              },
            });

            console.log('Variant Option Updated: ', updatedVariantOption.name);

            // Get existing variant option values (e.g. 8oz, 12oz, 16oz, Hot, Iced)
            const existingVariantOptionValues =
              await tx.productVariantOptionValue.findMany({
                where: { optionId: updatedVariantOption.id },
              });

            const existingOptionValuesMap = new Map(
              existingVariantOptionValues.map((v) => [v.id, v])
            );

            const optionValuesToUpdate = incomingOption.values.filter(
              (v) => v.id
            ); // with id

            const optionValuesToCreate = incomingOption.values.filter(
              (v) => !v.id
            ); // without id

            const idsOfOptionValuesToUpdate = incomingOption.values.map(
              (v) => v.id
            );

            const optionValuesToDelete = Array.from(
              existingOptionValuesMap.keys()
            ).filter((id) => !idsOfOptionValuesToUpdate.includes(id));

            // update
            for (const incomingValue of optionValuesToUpdate) {
              if (incomingValue.id) {
                const vov = await tx.productVariantOptionValue.update({
                  where: { id: incomingValue.id },
                  data: {
                    value: incomingValue.value,
                    position: incomingValue.position,
                  },
                });

                console.log('Variant Option Value Updated: ', vov.value);
              }
            }

            // create
            for (const incomingValue of optionValuesToCreate) {
              const newVov = await tx.productVariantOptionValue.create({
                data: {
                  optionId: incomingOption.id,
                  value: incomingValue.value,
                  position: incomingValue.position,
                },
              });

              console.log('Variant Option Value Created: ', newVov.value);
            }

            // delete
            if (optionValuesToDelete?.length > 0) {
              const { count } = await tx.productVariantOptionValue.deleteMany({
                where: { id: { in: optionValuesToDelete } },
              });

              console.log(`Deleted ${count} variant option value(s)`);
            }
          }
        }

        // create variant options
        for (const incomingOption of optionsToCreate) {
          const newVariantOption = await tx.productVariantOption.create({
            data: {
              productId: id,
              position: incomingOption.position,
              name: incomingOption.name,
              values: {
                createMany: {
                  data: incomingOption.values,
                },
              },
            },
          });

          console.log('Variant Option Created: ', newVariantOption.name);
        }

        // delete variant options
        if (optionsToDelete?.length > 0) {
          const { count } = await tx.productVariantOption.deleteMany({
            where: {
              id: { in: optionsToDelete },
            },
          });
          console.log(`Deleted ${count} variant option`);
        }
      }

      // handle variants if provided
      if (productData.hasVariants && variants?.length > 0) {
        // get existing variants
        const existingVariants = await prisma.productVariant.findMany({
          where: { productId: id },
        });

        const existingVariantsMap = new Map(
          existingVariants.map((variant) => [variant.id, variant])
        );

        const variantsToUpdate = variants.filter((variant) => variant.id); // with id

        const variantsToCreate = variants.filter((variant) => !variant.id); // without id

        const idsOfVariantsToUpdate = variantsToUpdate.map(
          (variant) => variant.id
        );

        const variantsToDelete = Array.from(existingVariantsMap.keys()).filter(
          (id) => !idsOfVariantsToUpdate.includes(id)
        );

        // update variants
        for (const incomingVariant of variantsToUpdate) {
          if (incomingVariant?.id) {
            const updatedVariant = await tx.productVariant.update({
              where: { id: incomingVariant.id },
              data: incomingVariant,
            });

            console.log('Variant Updated: ', updatedVariant.title);
          }
        }

        // create variants
        for (const incomingVariant of variantsToCreate) {
          const newVariant = await tx.productVariant.create({
            data: {
              productId: id,
              ...incomingVariant,
            },
          });

          console.log('Variant Created: ', newVariant.title);
        }

        // delete variants
        if (variantsToDelete?.length > 0) {
          const { count } = await tx.productVariant.deleteMany({
            where: { id: { in: variantsToDelete } },
          });

          console.log(`Deleted ${count} variant(s)`);
        }
      }

      // // Clear existing variant options and variants
      // await tx.productVariant.deleteMany({
      //   where: { productId: id },
      // });
      // await tx.productVariantOption.deleteMany({
      //   where: { productId: id },
      // });

      // // Recreate variant options if hasVariants is true
      // if (data.hasVariants && variantOptions.length > 0) {
      //   const createdOptions: Record<string, Record<string, string>> = {};

      //   for (const option of variantOptions) {
      //     const createdOption = await tx.productVariantOption.create({
      //       data: {
      //         productId: product.id,
      //         name: option.name,
      //         position: option.position,
      //       },
      //     });

      //     createdOptions[option.name] = {};

      //     for (const value of option.values) {
      //       const createdValue = await tx.productVariantOptionValue.create({
      //         data: {
      //           optionId: createdOption.id,
      //           value: value.value,
      //           position: value.position,
      //         },
      //       });

      //       createdOptions[option.name][value.value] = createdValue.id;
      //     }
      //   }

      //   // Recreate variants
      //   for (const variant of variants) {
      //     await tx.productVariant.create({
      //       data: {
      //         productId: product.id,
      //         title: variant.title,
      //         sku: variant.sku,
      //         price: variant.price,
      //         isDefault: variant.isDefault,
      //         isAvailable: variant.isAvailable,
      //       },
      //     });
      //   }
      // }

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
          variants: true,
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
