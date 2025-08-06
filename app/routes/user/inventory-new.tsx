import { ArrowLeftIcon } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { InventoryForm } from '~/features/inventory/inventory-form';
import prisma from '~/lib/prisma';
import { requireAuth } from '~/lib/utils.server';
import type { Route } from './+types/inventory-new';

export function meta() {
  return [{ title: 'New Inventory | Kape Natin PH' }];
}

export async function loader(args: Route.LoaderArgs) {
  const userId = await requireAuth(args);

  // get categories
  const categories = await prisma.category.findMany({ where: { userId } });

  const url = new URL(args.request.url);

  const duplicateId = url.searchParams.get('duplicateId');

  if (duplicateId) {
    const itemToDuplicate = await prisma.inventory.findUnique({
      where: { id: duplicateId },
    });

    return { itemToDuplicate, categories };
  }

  return { itemToDuplicate: null, categories };
}

function NewInventoryPage({ loaderData }: Route.ComponentProps) {
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
        <h1 className="font-semibold text-lg">
          {loaderData?.itemToDuplicate
            ? `Duplicate ${loaderData.itemToDuplicate.name}`
            : 'New Inventory'}
        </h1>
        <p className="text-sm text-muted-foreground">
          Create a new shop inventory
        </p>
      </div>
      <Separator />
      <InventoryForm
        categories={loaderData.categories}
        initialValue={loaderData?.itemToDuplicate}
      />
    </div>
  );
}

export default NewInventoryPage;
