import pluralize from 'pluralize';
import { InventoryStatus } from '~/generated/prisma/enums';
import type { InventoryCreateArgs } from '~/generated/prisma/models';
import { PAGINATION } from '~/lib/constants';
import prisma from '~/lib/prisma';
import { getSkip } from '~/lib/utils.server';

function determineInventoryStatus(
  quantity: number,
  reorderLevel?: number | null
): InventoryStatus {
  if (quantity === 0) {
    return InventoryStatus.OUT_OF_STOCK;
  }

  if (reorderLevel && quantity <= reorderLevel) {
    return InventoryStatus.LOW_IN_STOCK;
  }

  return InventoryStatus.IN_STOCK;
}

export interface GetInventoryItemsArgs {
  userId: string;
  page?: number;
  limit?: number;
  status?: InventoryStatus;
  search?: string;
}

export async function getInventoryItems({
  userId,
  status,
  page = PAGINATION.page,
  limit = PAGINATION.limit,
  search,
}: GetInventoryItemsArgs) {
  const totalDocs = await prisma.inventory.count({ where: { userId } });

  const inventoryItems = await prisma.inventory.findMany({
    where: { userId, status, name: { contains: search, mode: 'insensitive' } },
    include: { category: { select: { name: true } } },
    take: limit,
    skip: getSkip({ limit, page }),
  });

  return {
    pageInfo: {
      total: totalDocs,
      page,
      limit,
    },
    data: inventoryItems.map((i) => ({
      ...i,
      unit: pluralize(i.unit, i.quantity),
    })),
  };
}

export async function getInventoryItemsCountByStatus(userId: string) {
  const [inStockCount, lowInStockCount, outOfStockCount] = await Promise.all([
    prisma.inventory.count({
      where: { userId, status: InventoryStatus.IN_STOCK },
    }),
    prisma.inventory.count({
      where: { userId, status: InventoryStatus.LOW_IN_STOCK },
    }),
    prisma.inventory.count({
      where: { userId, status: InventoryStatus.OUT_OF_STOCK },
    }),
  ]);

  return { inStockCount, lowInStockCount, outOfStockCount };
}

export async function createInventory(data: InventoryCreateArgs['data']) {
  const status = determineInventoryStatus(data.quantity, data.reorderLevel);

  const inventory = await prisma.inventory.create({
    data: {
      ...data,
      status,
    },
  });

  return inventory;
}

export async function getInventoryById({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  const inventory = await prisma.inventory.findUnique({
    where: { id, userId },
    include: { category: { select: { id: true, name: true } } },
  });

  return inventory;
}

export async function updateInventory({
  id,
  userId,
  data,
}: {
  id: string;
  userId: string;
  data: Partial<InventoryCreateArgs['data']>;
}) {
  const status =
    data.quantity !== undefined && data.reorderLevel !== undefined
      ? determineInventoryStatus(data.quantity, data.reorderLevel)
      : undefined;

  const inventory = await prisma.inventory.update({
    where: { id, userId },
    data: {
      ...data,
      ...(status && { status }),
    },
  });

  return inventory;
}

export async function deleteInventory(id: string) {
  await prisma.inventory.delete({ where: { id } });
}
