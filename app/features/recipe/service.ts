import prisma from '~/lib/prisma';
import { PAGINATION } from '~/lib/constants';
import { getSkip } from '~/lib/utils.server';
import type { RecipeInputs } from './schema';

export interface GetRecipesArgs {
  userId: string;
  page?: number;
  limit?: number;
  search?: string;
  productId?: string;
  isActive?: boolean;
}

export const recipeService = {
  async getAllRecipes({
    userId,
    page = PAGINATION.page,
    limit = PAGINATION.limit,
    search,
    productId,
    isActive,
  }: GetRecipesArgs) {
    const where = {
      userId,
      ...(search && { name: { contains: search, mode: 'insensitive' as const } }),
      ...(productId && { productId }),
      ...(isActive !== undefined && { isActive }),
    };

    const totalDocs = await prisma.recipe.count({ where });

    const recipes = await prisma.recipe.findMany({
      where,
      include: {
        product: { select: { name: true, category: { select: { name: true } } } },
        productVariant: { 
          select: { 
            title: true, 
            product: { select: { name: true, category: { select: { name: true } } } } 
          } 
        },
        ingredients: {
          include: {
            inventory: { select: { name: true, unit: true, costPrice: true } },
          },
        },
        _count: {
          select: { ingredients: true },
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
      data: recipes,
    };
  },

  async getRecipeById(id: string, userId: string) {
    return await prisma.recipe.findFirst({
      where: { id, userId },
      include: {
        product: { select: { id: true, name: true, category: { select: { name: true } } } },
        productVariant: { 
          select: { 
            id: true,
            title: true, 
            product: { select: { id: true, name: true, category: { select: { name: true } } } } 
          } 
        },
        ingredients: {
          include: {
            inventory: { select: { id: true, name: true, unit: true, costPrice: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  },

  async createRecipe(data: RecipeInputs, userId: string) {
    const { ingredients, ...recipeData } = data;

    return await prisma.$transaction(async (tx) => {
      // Create the recipe first
      const recipe = await tx.recipe.create({
        data: {
          ...recipeData,
          userId,
          totalCost: 0, // Will be calculated after ingredients are added
        },
      });

      // Add ingredients and calculate total cost
      let totalCost = 0;
      
      for (const ingredient of ingredients) {
        // Get inventory item to calculate cost
        const inventoryItem = await tx.inventory.findUnique({
          where: { id: ingredient.inventoryId },
          select: { costPrice: true, unit: true },
        });

        if (!inventoryItem) {
          throw new Error(`Inventory item not found: ${ingredient.inventoryId}`);
        }

        await tx.recipeIngredient.create({
          data: {
            recipeId: recipe.id,
            inventoryId: ingredient.inventoryId,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            notes: ingredient.notes,
          },
        });

        // Calculate pro-rated cost for this ingredient
        // Assuming the inventory costPrice is per unit and we need to calculate based on quantity
        const ingredientCost = (inventoryItem.costPrice / 1) * ingredient.quantity; // Simple calculation
        totalCost += ingredientCost;
      }

      // Update recipe with calculated total cost
      const updatedRecipe = await tx.recipe.update({
        where: { id: recipe.id },
        data: { totalCost },
        include: {
          product: { select: { name: true, category: { select: { name: true } } } },
          productVariant: { 
            select: { 
              title: true, 
              product: { select: { name: true, category: { select: { name: true } } } } 
            } 
          },
          ingredients: {
            include: {
              inventory: { select: { name: true, unit: true, costPrice: true } },
            },
          },
        },
      });

      return updatedRecipe;
    });
  },

  async updateRecipe(id: string, data: RecipeInputs, userId: string) {
    const { ingredients, ...recipeData } = data;

    return await prisma.$transaction(async (tx) => {
      // Update the recipe
      const recipe = await tx.recipe.update({
        where: { id, userId },
        data: recipeData,
      });

      // Clear existing ingredients
      await tx.recipeIngredient.deleteMany({
        where: { recipeId: id },
      });

      // Add new ingredients and calculate total cost
      let totalCost = 0;
      
      for (const ingredient of ingredients) {
        // Get inventory item to calculate cost
        const inventoryItem = await tx.inventory.findUnique({
          where: { id: ingredient.inventoryId },
          select: { costPrice: true, unit: true },
        });

        if (!inventoryItem) {
          throw new Error(`Inventory item not found: ${ingredient.inventoryId}`);
        }

        await tx.recipeIngredient.create({
          data: {
            recipeId: recipe.id,
            inventoryId: ingredient.inventoryId,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            notes: ingredient.notes,
          },
        });

        // Calculate pro-rated cost for this ingredient
        const ingredientCost = (inventoryItem.costPrice / 1) * ingredient.quantity;
        totalCost += ingredientCost;
      }

      // Update recipe with calculated total cost
      return await tx.recipe.update({
        where: { id: recipe.id },
        data: { totalCost },
        include: {
          product: { select: { name: true, category: { select: { name: true } } } },
          productVariant: { 
            select: { 
              title: true, 
              product: { select: { name: true, category: { select: { name: true } } } } 
            } 
          },
          ingredients: {
            include: {
              inventory: { select: { name: true, unit: true, costPrice: true } },
            },
          },
        },
      });
    });
  },

  async deleteRecipe(id: string, userId: string) {
    return await prisma.recipe.delete({
      where: { id, userId },
    });
  },

  async getRecipesByProduct(productId: string, userId: string) {
    return await prisma.recipe.findMany({
      where: { productId, userId, isActive: true },
      include: {
        ingredients: {
          include: {
            inventory: { select: { name: true, unit: true } },
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  },

  async getRecipesByVariant(productVariantId: string, userId: string) {
    return await prisma.recipe.findMany({
      where: { productVariantId, userId, isActive: true },
      include: {
        ingredients: {
          include: {
            inventory: { select: { name: true, unit: true } },
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  },
};