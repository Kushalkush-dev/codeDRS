/*
  Warnings:

  - A unique constraint covering the columns `[polarCustomerId]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[polarSubscriptionId]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `polarCustomerId` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `polarSubscriptionId` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "polarCustomerId" TEXT NOT NULL,
ADD COLUMN     "polarSubscriptionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_polarCustomerId_key" ON "user"("polarCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "user_polarSubscriptionId_key" ON "user"("polarSubscriptionId");
