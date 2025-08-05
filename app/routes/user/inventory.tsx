import { PackageIcon, PlusIcon } from 'lucide-react';
import { data, Link } from 'react-router';
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
  deleteInventorySchema,
  updateInventorySchema,
} from '~/features/inventory/schema';
import {
  createInventory,
  deleteInventory,
  getInventoryItems,
  getInventoryItemsCountByStatus,
  updateInventory,
} from '~/features/inventory/service';
import { InventoryStatus } from '~/generated/prisma/enums';
import { handleActionError } from '~/lib/errorHandler';
import type { ActionResponse } from '~/lib/types';
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
  try {
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

      const response: ActionResponse = {
        success: true,
        intent,
        data: inventory,
      };

      return data(response, { status: 201 });
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

      const inventory = await updateInventory({
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

      const response: ActionResponse = {
        success: true,
        intent,
        data: inventory,
      };

      return data(response, { status: 200 });
    }

    if (intent === 'delete') {
      await deleteInventory(validationResult.data.id);

      const response: ActionResponse = {
        success: true,
        intent,
        data: {},
      };

      return data(response, { status: 200 });
    }
  } catch (error) {
    const errorResponse = handleActionError(error);

    const response: ActionResponse = {
      success: false,
      error: errorResponse.error,
      message: errorResponse.message,
      statusCode: errorResponse.statusCode,
      field: errorResponse.field,
    };

    return data(response, { status: errorResponse.statusCode });
  }
}

export default function InventoryPage({ loaderData }: Route.ComponentProps) {
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
