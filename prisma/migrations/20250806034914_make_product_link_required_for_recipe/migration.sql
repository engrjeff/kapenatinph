/*
  Warnings:

  - Made the column `productId` on table `Recipe` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Recipe" ALTER COLUMN "productId" SET NOT NULL;
