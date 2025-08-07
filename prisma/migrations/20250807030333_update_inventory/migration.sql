/*
  Warnings:

  - Added the required column `orderUnit` to the `Inventory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Inventory" ADD COLUMN     "orderUnit" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "productImages" TEXT[];
