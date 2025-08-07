import { ArrowLeftIcon } from 'lucide-react';
import { data, Link } from 'react-router';
import { PageTitle } from '~/components/page-title';
import { Button } from '~/components/ui/button';
import { getInventoryItems } from '~/features/inventory/service';
import { productService } from '~/features/product/service';
import { RecipeForm } from '~/features/recipe/recipe-form';
import { requireAuth } from '~/lib/utils.server';
import type { Route } from './+types/recipes.new';

export function meta() {
  return [{ title: 'New Recipe | Kape Natin PH' }];
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

  return data({
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
  });
}

export default function NewRecipePage({ loaderData }: Route.ComponentProps) {
  const { products, inventoryItems } = loaderData;

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
        title="New Recipe"
        subtitle="Create a new coffee recipe with ingredients and instructions"
      />

      <RecipeForm
        products={products}
        inventoryItems={inventoryItems}
        isEditing={false}
      />
    </div>
  );
}
