import { ChefHatIcon, PlusIcon } from 'lucide-react';
import { data, Link } from 'react-router';
import z from 'zod';
import { DataPagination } from '~/components/data-pagination';
import { PageTitle } from '~/components/page-title';
import { SearchField } from '~/components/search-field';
import { Button } from '~/components/ui/button';
import { RecipeTable } from '~/features/recipe/recipe-table';
import {
  createRecipeSchema,
  deleteRecipeSchema,
  updateRecipeSchema,
} from '~/features/recipe/schema';
import { recipeService } from '~/features/recipe/service';
import { handleActionError } from '~/lib/errorHandler';
import type { ActionResponse } from '~/lib/types';
import { requireAuth } from '~/lib/utils.server';
import type { Route } from './+types/recipes';

export function meta() {
  return [{ title: 'Recipes | Kape Natin PH' }];
}

export async function loader(args: Route.LoaderArgs) {
  const userId = await requireAuth(args);

  const url = new URL(args.request.url);

  const page = Number(url.searchParams.get('page')) || 1;
  const searchQuery = url.searchParams.get('search') ?? undefined;
  const productId = url.searchParams.get('productId') ?? undefined;
  const isActiveParam = url.searchParams.get('isActive');

  const isActive =
    isActiveParam === 'true'
      ? true
      : isActiveParam === 'false'
        ? false
        : undefined;

  const data = await recipeService.getAllRecipes({
    userId,
    page,
    search: searchQuery,
    productId,
    isActive,
  });

  return { ...data };
}

export async function action(args: Route.ActionArgs) {
  try {
    const userId = await requireAuth(args);

    const requestData = await args.request.json();

    const validationResult = z
      .discriminatedUnion('intent', [
        createRecipeSchema,
        updateRecipeSchema,
        deleteRecipeSchema,
      ])
      .safeParse(requestData);

    if (!validationResult.success) {
      return z.treeifyError(validationResult.error).properties;
    }

    const { intent } = validationResult.data;

    if (intent === 'create') {
      const {
        name,
        description,
        instructions,
        prepTimeMinutes,
        productId,
        productVariantId,
        isActive,
        ingredients,
      } = validationResult.data;

      const recipe = await recipeService.createRecipe(
        {
          name,
          description,
          instructions,
          prepTimeMinutes,
          productId,
          productVariantId,
          isActive,
          ingredients,
        },
        userId
      );

      const response: ActionResponse = {
        success: true,
        intent,
        data: recipe,
      };

      return data(response, { status: 201 });
    }

    if (intent === 'update') {
      const {
        id,
        name,
        description,
        instructions,
        prepTimeMinutes,
        productId,
        productVariantId,
        isActive,
        ingredients,
      } = validationResult.data;

      const recipe = await recipeService.updateRecipe(
        id,
        {
          name,
          description,
          instructions,
          prepTimeMinutes,
          productId,
          productVariantId,
          isActive,
          ingredients,
        },
        userId
      );

      const response: ActionResponse = {
        success: true,
        intent,
        data: recipe,
      };

      return data(response, { status: 200 });
    }

    if (intent === 'delete') {
      await recipeService.deleteRecipe(validationResult.data.id, userId);

      const response: ActionResponse = {
        success: true,
        intent,
        data: {},
      };

      return data(response, { status: 200 });
    }
  } catch (error) {
    const errorResponse = handleActionError(error);

    const response: ActionResponse = {
      success: false,
      error: errorResponse.error,
      message: errorResponse.message,
      statusCode: errorResponse.statusCode,
      field: errorResponse.field,
    };

    return data(response, { status: errorResponse.statusCode });
  }
}

export default function RecipesPage({ loaderData }: Route.ComponentProps) {
  const { data: recipes, pageInfo } = loaderData;

  if (recipes.length === 0) {
    return (
      <>
        <PageTitle
          title="Recipes"
          subtitle="Manage your coffee recipes and ingredient requirements"
        />
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center border border-dashed rounded-md">
          <div className="mb-4 p-3 rounded-full bg-muted/50 dark:bg-muted/20">
            <ChefHatIcon className="size-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No recipes yet.
          </h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-md leading-relaxed">
            Start by creating your first coffee recipe with ingredient measurements.
          </p>
          <Button size="sm" asChild>
            <Link to="/recipes/new">
              <PlusIcon /> Add Recipe
            </Link>
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <PageTitle
          title="Recipes"
          subtitle="Manage your coffee recipes and ingredient requirements"
        />
        <Button size="sm" asChild>
          <Link to="/recipes/new">
            <PlusIcon /> Add Recipe
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <SearchField placeholder="Search recipes..." />
      </div>

      <RecipeTable data={recipes} />

      <div className="mt-6">
        <DataPagination pageInfo={pageInfo} />
      </div>
    </>
  );
}
