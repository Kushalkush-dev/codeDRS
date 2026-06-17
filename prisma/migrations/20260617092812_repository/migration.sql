/*
  Warnings:

  - Added the required column `githubId` to the `repository` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "repository" ADD COLUMN     "githubId" TEXT NOT NULL;
