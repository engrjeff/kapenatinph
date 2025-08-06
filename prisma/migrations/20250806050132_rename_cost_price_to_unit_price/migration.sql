/*
  Warnings:

  - You are about to drop the column `costPrice` on the `Inventory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Inventory" DROP COLUMN "costPrice",
ADD COLUMN     "unitPrice" DOUBLE PRECISION NOT NULL DEFAULT 0;
