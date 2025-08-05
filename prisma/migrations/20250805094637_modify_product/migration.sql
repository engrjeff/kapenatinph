/*
  Warnings:

  - You are about to drop the column `comparePrice` on the `ProductVariant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,sku]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "sku" TEXT;

-- AlterTable
ALTER TABLE "public"."ProductVariant" DROP COLUMN "comparePrice";

-- CreateIndex
CREATE UNIQUE INDEX "Product_userId_sku_key" ON "public"."Product"("userId", "sku");
