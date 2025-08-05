-- AlterTable
ALTER TABLE "public"."Inventory" ALTER COLUMN "reorderLevel" DROP NOT NULL,
ALTER COLUMN "reorderLevel" SET DEFAULT 0;
