import { ArrowLeftIcon } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { productCategoryService } from '~/features/product-category/service';
import { ProductForm } from '~/features/product/product-form';
import { productService } from '~/features/product/service';
import { requireAuth } from '~/lib/utils.server';
import type { Route } from './+types/products.new';

export function meta({ data }: Route.MetaArgs) {
  return [
    {
      title: data?.itemToDuplicate
        ? `Duplicate Product | Kape Natin PH`
        : `New Product | Kape Natin PH`,
    },
  ];
}

export async function loader(args: Route.LoaderArgs) {
  const userId = await requireAuth(args);

  const categories =
    await productCategoryService.getAllProductCategories(userId);

  const url = new URL(args.request.url);

  const duplicateId = url.searchParams.get('duplicateId');

  if (duplicateId) {
    const itemToDuplicate = await productService.getProductById(
      duplicateId,
      userId
    );

    return { itemToDuplicate, categories };
  }

  return { itemToDuplicate: null, categories };
}

function NewProductPage({ loaderData }: Route.ComponentProps) {
  const isDuplicating = loaderData.itemToDuplicate !== null;

  return (
    <div className="space-y-4 container mx-auto max-w-2xl">
      <Button
        size="sm"
        variant="link"
        className="text-foreground px-0 has-[>svg]:px-0"
        asChild
      >
        <Link to="/products">
          <ArrowLeftIcon /> Back
        </Link>
      </Button>
      <div>
        <h1 className="font-semibold text-lg">
          {isDuplicating ? 'Duplicate Product' : 'New Product'}
        </h1>
        <p className="text-sm text-muted-foreground">
          Create a new product with optional variants
        </p>
      </div>
      <Separator />
      <ProductForm
        itemToDuplicate={loaderData.itemToDuplicate ?? undefined}
        categories={loaderData.categories}
      />
    </div>
  );
}

export default NewProductPage;
