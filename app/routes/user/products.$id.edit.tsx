import { ArrowLeftIcon, TrashIcon } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { ProductForm } from '~/features/product/product-form';
import { ProductDeleteDialog } from '~/features/product/product-delete-dialog';
import { productCategoryService } from '~/features/product-category/service';
import { productService } from '~/features/product/service';
import { requireAuth } from '~/lib/utils.server';
import type { Route } from './+types/products.$id.edit';

export function meta({ params }: Route.MetaArgs) {
  return [{ title: 'Edit Product | Kape Natin PH' }];
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
          <h3 className="font-semibold text-sm text-destructive">Danger Zone</h3>
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