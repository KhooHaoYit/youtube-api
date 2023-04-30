/*
  Warnings:

  - You are about to drop the column `externalLinks` on the `Channel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "externalLinks",
ADD COLUMN     "links" JSONB;
