-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "releases" TEXT[];

-- AlterTable
ALTER TABLE "Playlist" ADD COLUMN     "extraChannelIds" JSONB;
