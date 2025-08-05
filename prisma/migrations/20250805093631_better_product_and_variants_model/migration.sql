/*
  Warnings:

  - You are about to drop the column `name` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the `ProductVariantAttribute` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[productId,title]` on the table `ProductVariant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ProductVariantAttribute" DROP CONSTRAINT "ProductVariantAttribute_variantId_fkey";

-- DropIndex
DROP INDEX "public"."ProductVariant_productId_name_key";

-- AlterTable
ALTER TABLE "public"."ProductVariant" DROP COLUMN "name",
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "title" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."ProductVariantAttribute";

-- CreateTable
CREATE TABLE "public"."ProductVariantOption" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductVariantOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductVariantOptionValue" (
    "id" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductVariantOptionValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductVariantValue" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "optionValueId" TEXT NOT NULL,

    CONSTRAINT "ProductVariantValue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductVariantOption_productId_idx" ON "public"."ProductVariantOption"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariantOption_productId_name_key" ON "public"."ProductVariantOption"("productId", "name");

-- CreateIndex
CREATE INDEX "ProductVariantOptionValue_optionId_idx" ON "public"."ProductVariantOptionValue"("optionId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariantOptionValue_optionId_value_key" ON "public"."ProductVariantOptionValue"("optionId", "value");

-- CreateIndex
CREATE INDEX "ProductVariantValue_variantId_idx" ON "public"."ProductVariantValue"("variantId");

-- CreateIndex
CREATE INDEX "ProductVariantValue_optionValueId_idx" ON "public"."ProductVariantValue"("optionValueId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariantValue_variantId_optionValueId_key" ON "public"."ProductVariantValue"("variantId", "optionValueId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_productId_title_key" ON "public"."ProductVariant"("productId", "title");

-- AddForeignKey
ALTER TABLE "public"."ProductVariantOption" ADD CONSTRAINT "ProductVariantOption_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductVariantOptionValue" ADD CONSTRAINT "ProductVariantOptionValue_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "public"."ProductVariantOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductVariantValue" ADD CONSTRAINT "ProductVariantValue_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "public"."ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductVariantValue" ADD CONSTRAINT "ProductVariantValue_optionValueId_fkey" FOREIGN KEY ("optionValueId") REFERENCES "public"."ProductVariantOptionValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
