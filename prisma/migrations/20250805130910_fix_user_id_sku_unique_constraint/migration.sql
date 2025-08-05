/*
  Warnings:

  - A unique constraint covering the columns `[userId,name,sku]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Product_userId_sku_key";

-- CreateIndex
CREATE UNIQUE INDEX "Product_userId_name_sku_key" ON "public"."Product"("userId", "name", "sku");
