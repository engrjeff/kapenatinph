import { ArrowLeftIcon, PackageIcon } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { InventoryForm } from '~/features/inventory/inventory-form';
import { getInventoryById } from '~/features/inventory/service';
import prisma from '~/lib/prisma';
import { requireAuth } from '~/lib/utils.server';
import type { Route } from './+types/inventory-details';

export function meta({ data }: Route.MetaArgs) {
  if (!data?.inventoryItem) return [{ title: 'Not Found' }];

  return [{ title: `${data?.inventoryItem?.name} | Kape Natin PH` }];
}

export async function loader(args: Route.LoaderArgs) {
  const userId = await requireAuth(args);

  const inventoryItem = await getInventoryById({
    id: args.params.id!,
    userId,
  });

  if (!inventoryItem) {
    throw new Response('Inventory item not found', { status: 404 });
  }

  const categories = await prisma.category.findMany({ where: { userId } });

  return { inventoryItem, categories };
}


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
          Inventory item not found
        </h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md leading-relaxed">
          The inventory item you're looking for doesn't exist or has been removed.
        </p>
        <Button size="sm" asChild>
          <Link to="/inventory">
            <ArrowLeftIcon /> Back to Inventory
          </Link>
        </Button>
      </div>
    </div>
  );
}

function InventoryDetailsPage({
  loaderData: { inventoryItem, categories },
}: Route.ComponentProps) {
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
      <div>
        <h1 className="font-semibold text-lg">Edit {inventoryItem.name}</h1>
        <p className="text-sm text-muted-foreground">
          Update inventory item details
        </p>
      </div>
      <Separator />
      <InventoryForm
        categories={categories}
        initialValue={inventoryItem}
        isEditing
      />
    </div>
  );
}

export default InventoryDetailsPage;
