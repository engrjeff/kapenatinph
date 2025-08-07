/*
  Warnings:

  - You are about to drop the column `measurementPerUnit` on the `Inventory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Inventory" DROP COLUMN "measurementPerUnit",
ADD COLUMN     "amountPerUnit" DOUBLE PRECISION NOT NULL DEFAULT 0;
