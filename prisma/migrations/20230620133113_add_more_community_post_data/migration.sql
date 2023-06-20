-- AlterTable
ALTER TABLE "CommunityPost" ADD COLUMN     "content" TEXT,
ADD COLUMN     "extra" JSONB,
ADD COLUMN     "likeCount" INTEGER,
ADD COLUMN     "publishedTime" TEXT,
ADD COLUMN     "replyCount" INTEGER;
