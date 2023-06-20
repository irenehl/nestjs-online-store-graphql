/*
  Warnings:

  - A unique constraint covering the columns `[recovery]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_recovery_key" ON "user"("recovery");
