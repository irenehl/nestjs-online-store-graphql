/*
  Warnings:

  - The `role` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "roles" AS ENUM ('MANAGER', 'CLIENT');

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "role",
ADD COLUMN     "role" "roles" NOT NULL DEFAULT 'CLIENT';

-- DropEnum
DROP TYPE "Roles";
