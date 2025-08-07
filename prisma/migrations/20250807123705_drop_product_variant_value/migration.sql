/*
  Warnings:

  - You are about to drop the `ProductVariantValue` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ProductVariantValue" DROP CONSTRAINT "ProductVariantValue_optionValueId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductVariantValue" DROP CONSTRAINT "ProductVariantValue_variantId_fkey";

-- DropTable
DROP TABLE "public"."ProductVariantValue";
