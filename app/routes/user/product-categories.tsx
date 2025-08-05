import { FolderIcon, PlusIcon } from 'lucide-react';
import { Link, redirect } from 'react-router';
import z from 'zod';
import { PageTitle } from '~/components/page-title';
import { Button } from '~/components/ui/button';
import { productCategoryService } from '~/features/product-category/service';
import {
  createProductCategorySchema,
  updateProductCategorySchema,
  deleteProductCategorySchema,
} from '~/features/product-category/schema';
import { ProductCategoryTable } from '~/features/product-category/product-category-table';
import { ProductCategoryDialog } from '~/features/product-category/product-category-dialog';
import { requireAuth } from '~/lib/utils.server';
import type { Route } from './+types/product-categories';

export function meta() {
  return [{ title: 'Product Categories | Kape Natin PH' }];
}

export async function loader(args: Route.LoaderArgs) {
  const userId = await requireAuth(args);
  
  const categories = await productCategoryService.getAllProductCategories(userId);

  return { categories };
}

export async function action(args: Route.ActionArgs) {
  const userId = await requireAuth(args);
  const formData = await args.request.formData();
  const formEntries = Object.fromEntries(formData.entries());

  const validationResult = z
    .discriminatedUnion('intent', [
      createProductCategorySchema,
      updateProductCategorySchema,
      deleteProductCategorySchema,
    ])
    .safeParse(formEntries);

  if (!validationResult.success) {
    return z.treeifyError(validationResult.error).properties;
  }

  const { intent } = validationResult.data;

  if (intent === 'create') {
    const { name, description } = validationResult.data;
    await productCategoryService.createProductCategory({ name, description }, userId);
    return redirect('/product-categories');
  }

  if (intent === 'update') {
    const { id, name, description } = validationResult.data;
    await productCategoryService.updateProductCategory(id, { name, description }, userId);
    return redirect('/product-categories');
  }

  if (intent === 'delete') {
    try {
      await productCategoryService.deleteProductCategory(validationResult.data.id, userId);
      return redirect('/product-categories');
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to delete category' };
    }
  }
}

export default function ProductCategoriesPage({ loaderData, actionData }: Route.ComponentProps) {
  const { categories } = loaderData;

  if (categories.length === 0) {
    return (
      <>
        {actionData ? <pre>{JSON.stringify(actionData, null, 2)}</pre> : null}
        <PageTitle title="Product Categories" subtitle="Organize your products" />
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
          <ProductCategoryDialog
            mode="create"
            trigger={
              <Button size="sm">
                <PlusIcon /> Add Category
              </Button>
            }
          />
        </div>
      </>
    );
  }

  return (
    <>
      {actionData?.error && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">
          {actionData.error}
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <PageTitle title="Product Categories" subtitle="Organize your products" />
        <ProductCategoryDialog
          mode="create"
          trigger={
            <Button size="sm">
              <PlusIcon /> Add Category
            </Button>
          }
        />
      </div>
      
      <ProductCategoryTable categories={categories} />
    </>
  );
}