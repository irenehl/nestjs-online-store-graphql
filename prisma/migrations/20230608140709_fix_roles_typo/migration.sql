/*
  Warnings:

  - You are about to drop the column `updated_at` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "created_at",
DROP COLUMN "updated_at";
