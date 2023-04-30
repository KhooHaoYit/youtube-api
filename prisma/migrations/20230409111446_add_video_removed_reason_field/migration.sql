/*
  Warnings:

  - The values [removedFor] on the enum `Visibility` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Visibility_new" AS ENUM ('public', 'unlisted', 'private', 'deleted', 'removed');
ALTER TABLE "Video" ALTER COLUMN "visibility" TYPE "Visibility_new" USING ("visibility"::text::"Visibility_new");
ALTER TYPE "Visibility" RENAME TO "Visibility_old";
ALTER TYPE "Visibility_new" RENAME TO "Visibility";
DROP TYPE "Visibility_old";
COMMIT;

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "removedReason" TEXT,
ADD CONSTRAINT "Video_pkey" PRIMARY KEY ("id");
