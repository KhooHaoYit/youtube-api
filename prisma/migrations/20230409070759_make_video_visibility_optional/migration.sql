-- AlterEnum
ALTER TYPE "Visibility" ADD VALUE 'removedFor';

-- AlterTable
ALTER TABLE "Video" ALTER COLUMN "visibility" DROP NOT NULL;
