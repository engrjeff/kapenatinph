/*
  Warnings:

  - Made the column `sku` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `ProductVariant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Product" ALTER COLUMN "sku" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."ProductVariant" ALTER COLUMN "price" SET NOT NULL;
