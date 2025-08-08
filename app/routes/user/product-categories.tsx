import { FolderIcon } from 'lucide-react';
import { data } from 'react-router';
import z from 'zod';
import { PageTitle } from '~/components/page-title';
import { ProductCategoryDialog } from '~/features/product-category/product-category-dialog';
import { ProductCategoryTable } from '~/features/product-category/product-category-table';
import {
  createProductCategorySchema,
  deleteProductCategorySchema,
  updateProductCategorySchema,
} from '~/features/product-category/schema';
import { productCategoryService } from '~/features/product-category/service';
import { handleActionError } from '~/lib/errorHandler';
import type { ActionResponse } from '~/lib/types';
import { requireAuth } from '~/lib/utils.server';
import type { Route } from './+types/product-categories';

export function meta() {
  return [{ title: 'Product Categories | Kape Natin PH' }];
}

export async function loader(args: Route.LoaderArgs) {
  const userId = await requireAuth(args);

  const categories =
    await productCategoryService.getAllProductCategories(userId);

  return { categories };
}

export async function action(args: Route.ActionArgs) {
  try {
    const userId = await requireAuth(args);
    const body = await args.request.json();

    const validationResult = z
      .discriminatedUnion('intent', [
        createProductCategorySchema,
        updateProductCategorySchema,
        deleteProductCategorySchema,
      ])
      .safeParse(body);

    if (!validationResult.success) {
      return z.treeifyError(validationResult.error).properties;
    }

    const { intent } = validationResult.data;

    if (intent === 'create') {
      const { name, description } = validationResult.data;

      const category = await productCategoryService.createProductCategory(
        { name, description },
        userId
      );

      const response: ActionResponse = {
        success: true,
        intent,
        data: category,
      };

      return data(response, { status: 201 });
    }

    if (intent === 'update') {
      const { id, name, description } = validationResult.data;

      const category = await productCategoryService.updateProductCategory(
        id,
        { name, description },
        userId
      );

      const response: ActionResponse = {
        success: true,
        intent,
        data: category,
      };

      return data(response, { status: 200 });
    }

    if (intent === 'delete') {
      await productCategoryService.deleteProductCategory(
        validationResult.data.id,
        userId
      );

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

export default function ProductCategoriesPage({
  loaderData,
}: Route.ComponentProps) {
  const { categories } = loaderData;

  if (categories.length === 0) {
    return (
      <>
        <PageTitle
          title="Product Categories"
          subtitle="Organize your product categories"
        />
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center border border-dashed rounded-md">
          <div className="mb-4 p-3 rounded-full bg-muted/50 dark:bg-muted/20">
            <FolderIcon className="size-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No categories yet.
          </h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-md leading-relaxed">
            Create categories to organize your products.
          </p>
          <ProductCategoryDialog mode="create" />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <PageTitle
          title="Product Categories"
          subtitle="Organize your products"
        />
        <ProductCategoryDialog mode="create" />
      </div>

      <ProductCategoryTable categories={categories} />
    </>
  );
}
