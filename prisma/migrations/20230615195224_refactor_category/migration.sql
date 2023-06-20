/*
  Warnings:

  - A unique constraint covering the columns `[category_id]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category_id` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_name_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Product_category_id_key" ON "Product"("category_id");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
