import { PackageIcon, PlusIcon } from 'lucide-react';
import { Link, redirect } from 'react-router';
import z from 'zod';
import { DataPagination } from '~/components/data-pagination';
import { PageTitle } from '~/components/page-title';
import { SearchField } from '~/components/search-field';
import { Button } from '~/components/ui/button';
import { InventoryStats } from '~/features/inventory/inventory-stats';
import { InventoryStatusFilter } from '~/features/inventory/inventory-status-filter';
import { InventoryTable } from '~/features/inventory/inventory-table';
import {
  createInventorySchema,
  updateInventorySchema,
  deleteInventorySchema,
} from '~/features/inventory/schema';
import {
  createInventory,
  updateInventory,
  deleteInventory,
  getInventoryItems,
  getInventoryItemsCountByStatus,
} from '~/features/inventory/service';
import { InventoryStatus } from '~/generated/prisma/enums';
import { requireAuth } from '~/lib/utils.server';
import type { Route } from './+types/inventory';

export function meta() {
  return [{ title: 'Inventory | Kape Natin PH' }];
}

export async function loader(args: Route.LoaderArgs) {
  const userId = await requireAuth(args);

  const url = new URL(args.request.url);

  const page = Number(url.searchParams.get('page')) || 1;
  const statusParam = url.searchParams.get('status');
  const searchQuery = url.searchParams.get('search') ?? undefined;

  const status =
    statusParam &&
    Object.values(InventoryStatus).includes(statusParam as InventoryStatus)
      ? (statusParam as InventoryStatus)
      : undefined;

  const data = await getInventoryItems({
    userId,
    page,
    status,
    search: searchQuery,
  });

  const { inStockCount, lowInStockCount, outOfStockCount } =
    await getInventoryItemsCountByStatus(userId);

  return {
    pageInfo: data.pageInfo,
    inventoryItems: data.data,
    inStockCount,
    lowInStockCount,
    outOfStockCount,
  };
}

export async function action(args: Route.ActionArgs) {
  const userId = await requireAuth(args);

  const requestData = await args.request.json();

  const validationResult = z
    .discriminatedUnion('intent', [
      createInventorySchema,
      updateInventorySchema,
      deleteInventorySchema,
    ])
    .safeParse(requestData);

  if (!validationResult.success) {
    return z.treeifyError(validationResult.error).properties;
  }

  const { intent } = validationResult.data;

  if (intent === 'create') {
    const {
      name,
      sku,
      categoryId,
      unit,
      description,
      quantity,
      costPrice,
      reorderLevel,
      supplier,
    } = validationResult.data;

    const inventory = await createInventory({
      name,
      sku,
      categoryId,
      unit,
      description,
      quantity,
      costPrice,
      reorderLevel,
      supplier,
      userId,
    });

    return redirect('/inventory');
  }

  if (intent === 'update') {
    const {
      id,
      name,
      sku,
      categoryId,
      unit,
      description,
      quantity,
      costPrice,
      reorderLevel,
      supplier,
    } = validationResult.data;

    await updateInventory({
      id,
      userId,
      data: {
        name,
        sku,
        categoryId,
        unit,
        description,
        quantity,
        costPrice,
        reorderLevel,
        supplier,
      },
    });

    return redirect('/inventory');
  }

  if (intent === 'delete') {
    await deleteInventory(validationResult.data.id);

    return validationResult.data.id;
  }
}

export default function InventoryPage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const {
    inventoryItems,
    pageInfo,
    inStockCount,
    lowInStockCount,
    outOfStockCount,
  } = loaderData;

  if (pageInfo.total === 0)
    return (
      <>
        {actionData ? <pre>{JSON.stringify(actionData, null, 2)}</pre> : null}
        <PageTitle title="Inventory" subtitle="Manage your shop inventory" />
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center border border-dashed rounded-md">
          <div className="mb-4 p-3 rounded-full bg-muted/50 dark:bg-muted/20">
            <PackageIcon className="size-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No inventory items yet.
          </h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-md leading-relaxed">
            Start by adding items now.
          </p>
          <Button size="sm" asChild>
            <Link to="/inventory/new">
              <PlusIcon /> Add Inventory
            </Link>
          </Button>
        </div>
      </>
    );

  return (
    <>
      <div className="flex items-center justify-between">
        <PageTitle title="Inventory" subtitle="Manage your shop inventory" />
        <Button size="sm" asChild>
          <Link to="/inventory/new">
            <PlusIcon /> Add Inventory
          </Link>
        </Button>
      </div>
      <InventoryStats
        inStockCount={inStockCount}
        lowInStockCount={lowInStockCount}
        outOfStockCount={outOfStockCount}
      />
      <div className="flex items-center justify-between mb-4">
        <SearchField />
        <InventoryStatusFilter />
      </div>
      <InventoryTable data={inventoryItems} />
      <div className="mt-6">
        <DataPagination pageInfo={pageInfo} />
      </div>
    </>
  );
}
