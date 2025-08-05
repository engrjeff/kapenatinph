import { PackageIcon, PlusIcon, SettingsIcon } from 'lucide-react';
import { Link, redirect, useFetcher } from 'react-router';
import z from 'zod';
import { PageTitle } from '~/components/page-title';
import { Button } from '~/components/ui/button';
import {
  createProductSchema,
  deleteProductSchema,
  updateProductSchema,
} from '~/features/product/schema';
import { productService } from '~/features/product/service';
import { requireAuth } from '~/lib/utils.server';
import type { Route } from './+types/products';

export function meta() {
  return [{ title: 'Products | Kape Natin PH' }];
}

export async function loader(args: Route.LoaderArgs) {
  const userId = await requireAuth(args);

  const products = await productService.getAllProducts(userId);

  return { products };
}

export async function action(args: Route.ActionArgs) {
  const userId = await requireAuth(args);

  let requestData = await args.request.json();

  const validationResult = z
    .discriminatedUnion('intent', [
      createProductSchema,
      updateProductSchema,
      deleteProductSchema,
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
      categoryId,
      sku,
      basePrice,
      isActive,
      hasVariants,
      variantOptions,
      variants,
    } = validationResult.data;
    await productService.createProduct(
      {
        name,
        description,
        categoryId,
        sku,
        basePrice,
        isActive,
        hasVariants,
        variantOptions,
        variants,
      },
      userId
    );
    return redirect('/products');
  }

  if (intent === 'update') {
    const {
      id,
      name,
      description,
      categoryId,
      sku,
      basePrice,
      isActive,
      hasVariants,
      variantOptions,
      variants,
    } = validationResult.data;
    await productService.updateProduct(
      id,
      {
        name,
        description,
        categoryId,
        sku,
        basePrice,
        isActive,
        hasVariants,
        variantOptions,
        variants,
      },
      userId
    );
    return redirect('/products');
  }

  if (intent === 'delete') {
    await productService.deleteProduct(validationResult.data.id, userId);
    return validationResult.data.id;
  }
}

export default function ProductsPage({ loaderData }: Route.ComponentProps) {
  const { products } = loaderData;
  const deleteFetcher = useFetcher();

  const handleDelete = (productId: string) => {
    if (
      confirm(
        'Are you sure you want to delete this product? This action cannot be undone.'
      )
    ) {
      deleteFetcher.submit(
        { intent: 'delete', id: productId },
        { method: 'POST' }
      );
    }
  };

  if (products.length === 0) {
    return (
      <>
        <div className="flex items-center justify-between gap-4">
          <PageTitle title="Products" subtitle="Manage your products" />
          <Button
            size="icon"
            variant="outline"
            className="size-8"
            aria-label="Settings"
            asChild
          >
            <Link to="/product-categories">
              <SettingsIcon />
            </Link>
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center border border-dashed rounded-md">
          <div className="mb-4 p-3 rounded-full bg-muted/50 dark:bg-muted/20">
            <PackageIcon className="size-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No products yet.
          </h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-md leading-relaxed">
            Start by adding products now.
          </p>
          <Button size="sm" asChild>
            <Link to="/products/new">
              <PlusIcon /> Add Product
            </Link>
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <PageTitle title="Products" subtitle="Manage your products" />
        <div className="flex gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link to="/product-categories">Categories</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/products/new">
              <PlusIcon /> Add Product
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {product.category.name}
                </p>
                <p className="text-sm font-medium">₱{product.basePrice}</p>
                {product.hasVariants && (
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>{product.variants.length} variant(s)</p>
                    {product.variantOptions.map((option) => (
                      <p key={option.id}>
                        <span className="font-medium">{option.name}:</span>{' '}
                        {option.values.map((v) => v.value).join(', ')}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" asChild>
                  <Link to={`/products/${product.id}/edit`}>Edit</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
