/*
  Warnings:

  - You are about to drop the column `i_fetchedAt` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `i_fetchedAt` on the `CommunityPost` table. All the data in the column will be lost.
  - You are about to drop the column `i_fetchedAt` on the `Playlist` table. All the data in the column will be lost.
  - You are about to drop the column `i_fetchedAt` on the `Video` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "i_fetchedAt";

-- AlterTable
ALTER TABLE "CommunityPost" DROP COLUMN "i_fetchedAt";

-- AlterTable
ALTER TABLE "Playlist" DROP COLUMN "i_fetchedAt";

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "i_fetchedAt";
