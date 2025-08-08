import { ArrowLeftIcon } from 'lucide-react';
import { Link, redirect } from 'react-router';
import { PageTitle } from '~/components/page-title';
import { Button } from '~/components/ui/button';
import { getInventoryItems } from '~/features/inventory/service';
import { productService } from '~/features/product/service';
import { RecipeForm } from '~/features/recipe/recipe-form';
import { recipeService } from '~/features/recipe/service';
import { requireAuth } from '~/lib/utils.server';
import type { Route } from './+types/recipes.new';

export function meta({ data }: Route.MetaArgs) {
  return [
    {
      title: data?.itemToDuplicate
        ? 'Duplicate Recipe | Kape Natin PH'
        : 'New Recipe | Kape Natin PH',
    },
  ];
}

export async function loader(args: Route.LoaderArgs) {
  const userId = await requireAuth(args);

  const [products, inventoryData] = await Promise.all([
    productService.getAllProducts({ userId }),
    getInventoryItems({
      userId,
      limit: 1000, // Get all inventory items for the form
    }),
  ]);

  const defaultLoaderData = {
    products: products.data.map((p) => ({
      id: p.id,
      name: p.name,
      hasVariants: p.hasVariants,
      variants: p.variants?.map((v) => ({
        id: v.id,
        title: v.title,
      })),
    })),
    inventoryItems: inventoryData.data.map((item) => ({
      id: item.id,
      name: item.name,
      unit: item.unit,
      unitPrice: item.unitPrice,
    })),
    itemToDuplicate: null,
  };

  const url = new URL(args.request.url);

  const duplicateId = url.searchParams.get('duplicateId');

  if (duplicateId) {
    const itemToDuplicate = await recipeService.getRecipeById(
      duplicateId,
      userId
    );

    if (itemToDuplicate) {
      return {
        products: defaultLoaderData.products,
        inventoryItems: defaultLoaderData.inventoryItems,
        itemToDuplicate,
      };
    } else {
      return redirect('/recipes/new');
    }
  }

  return defaultLoaderData;
}

export default function NewRecipePage({ loaderData }: Route.ComponentProps) {
  const { products, inventoryItems, itemToDuplicate } = loaderData;

  return (
    <div className="space-y-4 container mx-auto max-w-xl">
      <Button
        size="sm"
        variant="link"
        className="text-foreground px-0 has-[>svg]:px-0"
        asChild
      >
        <Link to="/recipes">
          <ArrowLeftIcon /> Back
        </Link>
      </Button>
      <PageTitle
        title={itemToDuplicate ? 'Duplicate Recipe' : 'New Recipe'}
        subtitle="Create a new recipe with ingredients and instructions"
      />

      <RecipeForm
        products={products}
        inventoryItems={inventoryItems}
        initialValue={itemToDuplicate ? itemToDuplicate : undefined}
        isEditing={false}
        isDuplicating={itemToDuplicate ? true : false}
      />
    </div>
  );
}
