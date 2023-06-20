/*
  Warnings:

  - You are about to drop the `favorite` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "favorite" DROP CONSTRAINT "favorite_product_sku_fkey";

-- DropForeignKey
ALTER TABLE "favorite" DROP CONSTRAINT "favorite_user_id_fkey";

-- DropTable
DROP TABLE "favorite";

-- CreateTable
CREATE TABLE "likes_on_products" (
    "user_id" INTEGER NOT NULL,
    "product_sku" INTEGER NOT NULL,

    CONSTRAINT "likes_on_products_pkey" PRIMARY KEY ("user_id","product_sku")
);

-- AddForeignKey
ALTER TABLE "likes_on_products" ADD CONSTRAINT "likes_on_products_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes_on_products" ADD CONSTRAINT "likes_on_products_product_sku_fkey" FOREIGN KEY ("product_sku") REFERENCES "product"("SKU") ON DELETE RESTRICT ON UPDATE CASCADE;
