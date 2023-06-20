-- DropForeignKey
ALTER TABLE "cart" DROP CONSTRAINT "cart_user_id_fkey";

-- DropForeignKey
ALTER TABLE "likes_on_products" DROP CONSTRAINT "likes_on_products_product_sku_fkey";

-- DropForeignKey
ALTER TABLE "likes_on_products" DROP CONSTRAINT "likes_on_products_user_id_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_user_id_fkey";

-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_category_id_fkey";

-- DropForeignKey
ALTER TABLE "products_on_carts" DROP CONSTRAINT "products_on_carts_cart_id_fkey";

-- DropForeignKey
ALTER TABLE "products_on_carts" DROP CONSTRAINT "products_on_carts_product_sku_fkey";

-- DropForeignKey
ALTER TABLE "products_on_orders" DROP CONSTRAINT "products_on_orders_order_id_fkey";

-- DropForeignKey
ALTER TABLE "products_on_orders" DROP CONSTRAINT "products_on_orders_product_sku_fkey";

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_on_carts" ADD CONSTRAINT "products_on_carts_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_on_carts" ADD CONSTRAINT "products_on_carts_product_sku_fkey" FOREIGN KEY ("product_sku") REFERENCES "product"("SKU") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_on_orders" ADD CONSTRAINT "products_on_orders_product_sku_fkey" FOREIGN KEY ("product_sku") REFERENCES "product"("SKU") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_on_orders" ADD CONSTRAINT "products_on_orders_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes_on_products" ADD CONSTRAINT "likes_on_products_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes_on_products" ADD CONSTRAINT "likes_on_products_product_sku_fkey" FOREIGN KEY ("product_sku") REFERENCES "product"("SKU") ON DELETE CASCADE ON UPDATE CASCADE;
