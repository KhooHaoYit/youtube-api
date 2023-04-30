import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from 'nestjs-prisma';
import { YoutubeScraper } from './youtube/scraper';

@Controller()
export class AppController {

  constructor(
    private service: AppService,
    private prisma: PrismaService,
    private scraper: YoutubeScraper,
  ) { }

  @Get('video/:id')
  async getVideo(@Param('id') id: string) {
    return await this.prisma.video.findUnique({
      where: { id },
      include: { channel: true },
    }).then(stringify);
  }

  @Post('video/:id/select')
  async getVideoWithSelect(
    @Param('id') id: string,
    @Body() select: any,
  ) {
    return await this.prisma.video.findUnique({
      where: { id },
      select,
    }).then(stringify);
  }

  @Get('video/:id/exists')
  async hasVideo(@Param('id') id: string) {
    const result = await this.prisma.video.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!result;
  }

  @Post('video/:id/fetch')
  async fetchVideo(@Param('id') id: string) {
    await this.service.updateVideo(id);
    // await this.scraper.scrapeVideo(id);
    return await this.getVideo(id);
  }

  @Get('playlist/:id')
  async getPlaylist(@Param('id') id: string) {
    return await this.prisma.playlist.findUnique({
      where: { id },
      include: {
        channel: true,
      },
    }).then(res => stringify(res));
  }

  @Post('playlist/:id/fetch')
  async fetchPlaylist(@Param('id') id: string) {
    await this.service.updatePlaylist(id);
    return await this.getPlaylist(id);
  }

  @Get('channel/:id/playlists')
  async getChannelPlaylists(@Param('id') id: string) {
    return await this.prisma.channel.findUnique({
      where: { id },
      include: { playlists: true },
    }).then(channel => stringify(channel?.playlists || null));
  }

  @Post('channel/:id/playlists/fetch')
  async fetchChannelPlaylists(@Param('id') id: string) {
    await this.scraper.scrapeChannelPlaylists(id);
    return await this.getChannelPlaylists(id);
  }

  @Get('channel/:id')
  async getChannel(@Param('id') id: string) {
    return await this.prisma.channel.findUnique({
      where: { id },
    }).then(channel => stringify(channel || null));
  }

  @Post('channel/:id/fetchAll')
  async fetchChannelAll(@Param('id') id: string) {
    await this.scraper.scrapeChannelAbout(id);
    await this.scraper.scrapeChannelChannels(id);
    await this.scraper.scrapeChannelFeatured(id);
    await this.scraper.scrapeChannelPlaylists(id);
    const { playlists } = await this.prisma.channel.findUniqueOrThrow({
      where: { id },
      select: {
        playlists: {
          select: { id: true },
        },
      },
    });
    for (const { id } of playlists)
      await this.service.updatePlaylist(id);
    return await this.getChannel(id);
  }

  @Get('channel/:id/videos')
  async getChannelVideos(@Param('id') id: string) {
    return await this.prisma.channel.findUnique({
      where: { id },
      select: {
        videos: {
          select: { id: true },
        },
      },
    }).then(channel => stringify(channel?.videos.map(video => video.id) || null));
  }

  @Post('channel/:id/about/fetch')
  async fetchChannelAbout(@Param('id') id: string) {
    await this.scraper.scrapeChannelAbout(id);
    return await this.getChannel(id);
  }

  @Get('channel/:id/channels')
  async getChannelChannels(@Param('id') id: string) {
    return await this.prisma.channel.findUnique({
      where: { id },
      select: {
        channels: true,
      },
    }).then(channel => stringify(channel?.channels || null));
  }

  @Post('channel/:id/channels/fetch')
  async fetchChannelChannels(@Param('id') id: string) {
    await this.scraper.scrapeChannelChannels(id);
    return await this.getChannelChannels(id);
  }

  @Post('channel/:id/featured/fetch')
  async fetchChannelFeatured(@Param('id') id: string) {
    await this.scraper.scrapeChannelFeatured(id);
    return await this.getChannel(id);
  }

  @Post('channel/:id/fetchMembershipInfo')
  async fetchMembershipInfo(
    @Param('id') id: string,
    @Body() body: Record<string, string>,
  ) {
    return await this.scraper.scrapeChannelMembership(id, body);
  }

}

function stringify(data: unknown) {
  return JSON.stringify(data, (key, value) => {
    if (typeof value === 'bigint')
      return value.toString();
    return value;
  });
}
