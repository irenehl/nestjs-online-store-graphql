/*
  Warnings:

  - You are about to drop the `Cart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Favorite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductsOnCarts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductsOnOrders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_product_sku_fkey";

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_category_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductsOnCarts" DROP CONSTRAINT "ProductsOnCarts_cart_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductsOnCarts" DROP CONSTRAINT "ProductsOnCarts_product_sku_fkey";

-- DropForeignKey
ALTER TABLE "ProductsOnOrders" DROP CONSTRAINT "ProductsOnOrders_order_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductsOnOrders" DROP CONSTRAINT "ProductsOnOrders_product_sku_fkey";

-- DropTable
DROP TABLE "Cart";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Favorite";

-- DropTable
DROP TABLE "Order";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "ProductsOnCarts";

-- DropTable
DROP TABLE "ProductsOnOrders";

-- CreateTable
CREATE TABLE "product" (
    "SKU" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" VARCHAR(200) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL,
    "image" TEXT,
    "imageUrl" TEXT,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("SKU")
);

-- CreateTable
CREATE TABLE "order" (
    "id" SERIAL NOT NULL,
    "ordered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(15) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products_on_carts" (
    "quantity" INTEGER NOT NULL,
    "cart_id" INTEGER NOT NULL,
    "product_sku" INTEGER NOT NULL,

    CONSTRAINT "products_on_carts_pkey" PRIMARY KEY ("cart_id","product_sku")
);

-- CreateTable
CREATE TABLE "products_on_orders" (
    "quantity" INTEGER NOT NULL,
    "product_sku" INTEGER NOT NULL,
    "order_id" INTEGER NOT NULL,

    CONSTRAINT "products_on_orders_pkey" PRIMARY KEY ("product_sku","order_id")
);

-- CreateTable
CREATE TABLE "favorite" (
    "user_id" INTEGER NOT NULL,
    "product_sku" INTEGER NOT NULL,

    CONSTRAINT "favorite_pkey" PRIMARY KEY ("user_id","product_sku")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_name_key" ON "product"("name");

-- CreateIndex
CREATE UNIQUE INDEX "product_category_id_key" ON "product"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "cart_user_id_key" ON "cart"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_on_carts" ADD CONSTRAINT "products_on_carts_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_on_carts" ADD CONSTRAINT "products_on_carts_product_sku_fkey" FOREIGN KEY ("product_sku") REFERENCES "product"("SKU") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_on_orders" ADD CONSTRAINT "products_on_orders_product_sku_fkey" FOREIGN KEY ("product_sku") REFERENCES "product"("SKU") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_on_orders" ADD CONSTRAINT "products_on_orders_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_product_sku_fkey" FOREIGN KEY ("product_sku") REFERENCES "product"("SKU") ON DELETE RESTRICT ON UPDATE CASCADE;
