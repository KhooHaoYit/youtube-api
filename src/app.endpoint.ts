import { Prisma } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";
import { AppService } from "./app.service";

class Service {
  constructor(
    private prisma: PrismaService,
    private service: AppService,
  ) { }
  async getChannelAllVideos(channelId: string, videoSelect: Prisma.VideoSelect) {
    const result = await this.prisma.channel.findUnique({
      where: { id: channelId },
      select: {
        videos: { select: videoSelect },
      },
    });
    return result?.videos || null;
  }
  async fetchVideo(videoId: string, videoSelect: Prisma.VideoSelect) {
    await this.service.updateVideo(videoId);
    return await this.getVideo(videoId, videoSelect);
  }
  async getVideo(videoId: string, videoSelect: Prisma.VideoSelect) {
    return await this.prisma.video.findUnique({
      where: { id: videoId },
      select: videoSelect,
    });
  }
}