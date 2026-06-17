/*
  Warnings:

  - A unique constraint covering the columns `[githubId]` on the table `repository` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `githubId` on the `repository` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "repository" DROP COLUMN "githubId",
ADD COLUMN     "githubId" BIGINT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "repository_githubId_key" ON "repository"("githubId");
