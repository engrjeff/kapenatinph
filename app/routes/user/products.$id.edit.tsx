import { ArrowLeftIcon, PackageIcon, TrashIcon } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { productCategoryService } from '~/features/product-category/service';
import { ProductDeleteDialog } from '~/features/product/product-delete-dialog';
import { ProductForm } from '~/features/product/product-form';
import { productService } from '~/features/product/service';
import { requireAuth } from '~/lib/utils.server';
import type { Route } from './+types/products.$id.edit';

export function meta({ data }: Route.MetaArgs) {
  return [
    {
      title: data?.product
        ? `Edit ${data?.product?.name} | Kape Natin PH`
        : 'Not Found',
    },
  ];
}

export async function loader(args: Route.LoaderArgs) {
  const userId = await requireAuth(args);
  const { id } = args.params;

  const [product, categories] = await Promise.all([
    productService.getProductById(id, userId),
    productCategoryService.getAllProductCategories(userId),
  ]);

  if (!product) {
    throw new Response('Product not found', { status: 404 });
  }

  return { product, categories };
}

function EditProductPage({ loaderData }: Route.ComponentProps) {
  const { product, categories } = loaderData;

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
        <h1 className="font-semibold text-lg">Edit Product</h1>
        <p className="text-sm text-muted-foreground">
          Update product information and variants
        </p>
      </div>
      <Separator />
      <ProductForm
        initialValue={product}
        categories={categories}
        isEditing={true}
      />
      <Separator />
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-sm text-destructive">
            Danger Zone
          </h3>
          <p className="text-xs text-muted-foreground">
            Permanently delete this product and all its data
          </p>
        </div>
        <ProductDeleteDialog
          product={product}
          trigger={
            <Button variant="destructive" size="sm">
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete Product
            </Button>
          }
        />
      </div>
    </div>
  );
}

export default EditProductPage;

export function ErrorBoundary() {
  return (
    <div className="space-y-4 container mx-auto max-w-lg">
      <Button
        size="sm"
        variant="link"
        className="text-foreground px-0 has-[>svg]:px-0"
        asChild
      >
        <Link to="/inventory">
          <ArrowLeftIcon /> Back
        </Link>
      </Button>
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center border border-dashed rounded-md">
        <div className="mb-4 p-3 rounded-full bg-muted/50 dark:bg-muted/20">
          <PackageIcon className="size-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Product not found
        </h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md leading-relaxed">
          The product you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Button size="sm" asChild>
          <Link to="/products">
            <ArrowLeftIcon /> Back to Products
          </Link>
        </Button>
      </div>
    </div>
  );
}
