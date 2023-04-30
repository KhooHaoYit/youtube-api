-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('public', 'unlisted', 'private');

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "visibility" "Visibility" NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "keywords" TEXT[],
    "category" TEXT,
    "publishDate" TEXT,
    "uploadDate" TEXT,
    "liveStartTimestamp" TIMESTAMP(3),
    "liveEndTimestamp" TIMESTAMP(3),
    "viewCount" BIGINT,
    "duration" INTEGER,
    "isLivestream" BOOLEAN,
    "isAgeRestricted" BOOLEAN,
    "isMembershipContent" BOOLEAN,
    "channelId" TEXT,
    "i_createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "i_updatedAt" TIMESTAMP(3) NOT NULL,
    "i_fetchedAt" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "handle" TEXT,
    "avatarUrl" TEXT,
    "verified" BOOLEAN,
    "subscriberCount" INTEGER,
    "i_createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "i_updatedAt" TIMESTAMP(3) NOT NULL,
    "i_fetchedAt" TIMESTAMP(3)
);

-- CreateIndex
CREATE UNIQUE INDEX "Video_id_key" ON "Video"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_id_key" ON "Channel"("id");

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
