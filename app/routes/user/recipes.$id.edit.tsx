import { ArrowLeftIcon } from 'lucide-react';
import { data, Link } from 'react-router';
import { PageTitle } from '~/components/page-title';
import { Button } from '~/components/ui/button';
import { getInventoryItems } from '~/features/inventory/service';
import { productService } from '~/features/product/service';
import { RecipeForm } from '~/features/recipe/recipe-form';
import { recipeService } from '~/features/recipe/service';
import { requireAuth } from '~/lib/utils.server';
import type { Route } from './+types/recipes.$id.edit';

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `Edit Recipe | Kape Natin PH` }];
}

export async function loader(args: Route.LoaderArgs) {
  const userId = await requireAuth(args);
  const { id } = args.params;

  const [recipe, products, inventoryData] = await Promise.all([
    recipeService.getRecipeById(id, userId),
    productService.getAllProducts(userId),
    getInventoryItems({
      userId,
      limit: 1000, // Get all inventory items for the form
    }),
  ]);

  if (!recipe) {
    throw new Response('Recipe not found', { status: 404 });
  }

  return data({
    recipe,
    products: products.map((p) => ({
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
      costPrice: item.costPrice,
    })),
  });
}

export default function EditRecipePage({ loaderData }: Route.ComponentProps) {
  const { recipe, products, inventoryItems } = loaderData;

  return (
    <div className="space-y-4 container mx-auto max-w-lg">
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
        title={`Edit Recipe: ${recipe.name}`}
        subtitle="Update recipe details, ingredients, and instructions"
      />

      <RecipeForm
        initialValue={recipe}
        products={products}
        inventoryItems={inventoryItems}
        isEditing={true}
      />
    </div>
  );
}
