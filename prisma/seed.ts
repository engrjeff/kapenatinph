import { PrismaClient } from '../app/generated/prisma/client.js';

const prisma = new PrismaClient();

// this is actually for deleting records
// only for development
export async function main() {
  // delete products
  await prisma.product.deleteMany();
  // delete product categories
  await prisma.productCategory.deleteMany();
  // delete inventory
  await prisma.inventory.deleteMany();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    if (e instanceof Error) {
      console.error(e.message);
    } else {
      console.error(e);
    }

    await prisma.$disconnect();
    process.exit(1);
  });
