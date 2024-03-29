import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
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

  @Get('/video/:id')
  async getVideo(@Param('id') id: string) {
    return await this.prisma.video.findUnique({
      where: { id },
      include: { channel: true },
    }).then(stringify);
  }

  @Post('/video/:id/select')
  async getVideoWithSelect(
    @Param('id') id: string,
    @Body() select: any,
  ) {
    return await this.prisma.video.findUnique({
      where: { id },
      select,
    }).then(stringify);
  }

  @Get('/video/:id/exists')
  async hasVideo(@Param('id') id: string) {
    const result = await this.prisma.video.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!result;
  }

  @Post('/video/:id/fetch')
  async fetchVideo(@Param('id') id: string) {
    await this.service.updateVideo(id);
    // await this.scraper.scrapeVideo(id);
    return await this.getVideo(id);
  }

  @Get('/playlist/:id')
  async getPlaylist(@Param('id') id: string) {
    return await this.prisma.playlist.findUnique({
      where: { id },
      include: {
        channel: true,
      },
    }).then(res => stringify(res));
  }

  @Post('/playlist/:id/fetch')
  async fetchPlaylist(@Param('id') id: string) {
    await this.scraper.scrapePlaylist(id);
    // await this.service.updatePlaylist(id);
    return await this.getPlaylist(id);
  }

  @Get('/channel/:id/playlists')
  async getChannelPlaylists(@Param('id') id: string) {
    return await this.prisma.channel.findUnique({
      where: { id },
      include: { playlists: true },
    }).then(channel => stringify(channel?.playlists || null));
  }

  @Post('/channel/:id/playlists/fetch')
  async fetchChannelPlaylists(@Param('id') id: string) {
    await this.scraper.scrapeChannelPlaylists(id);
    return await this.getChannelPlaylists(id);
  }

  @Get('/channel/:id')
  async getChannel(@Param('id') id: string) {
    return await this.prisma.channel.findUnique({
      where: { id },
    }).then(channel => stringify(channel || null));
  }

  @Post('/channel/:id/fetchAll')
  async fetchChannelAll(
    @Param('id') channelId: string,
    @Query('includeVideo') _includeVideo?: string
  ) {
    const includeVideo = _includeVideo !== '0';
    await this.scraper.scrapeChannelAbout(channelId);
    await this.scraper.scrapeChannelFeatured(channelId);
    await this.scraper.scrapeChannelPlaylists(channelId);
    await this.scraper.scrapeChannelReleasesTab(channelId);
    await this.scraper.scrapeChannelCommunityTab(channelId);
    const { playlists, releases } = await this.prisma.channel.findUniqueOrThrow({
      where: { id: channelId },
      select: {
        playlists: {
          select: { id: true },
        },
        releases: true,
      },
    });
    for (const { id } of playlists)
      await this.scraper.scrapePlaylist(id);
    for (const id of releases)
      await this.scraper.scrapePlaylist(id);
    await this.scraper.scrapePlaylist(channelId.replace('UC', 'UU'));
    await this.scraper.scrapePlaylist(channelId.replace('UC', 'UULF'));
    await this.scraper.scrapePlaylist(channelId.replace('UC', 'UULP'));
    await this.scraper.scrapePlaylist(channelId.replace('UC', 'UULV'));
    await this.scraper.scrapePlaylist(channelId.replace('UC', 'UUMF'));
    await this.scraper.scrapePlaylist(channelId.replace('UC', 'UUMO'));
    await this.scraper.scrapePlaylist(channelId.replace('UC', 'UUMS'));
    await this.scraper.scrapePlaylist(channelId.replace('UC', 'UUMV'));
    await this.scraper.scrapePlaylist(channelId.replace('UC', 'UUPS'));
    await this.scraper.scrapePlaylist(channelId.replace('UC', 'UUPV'));
    await this.scraper.scrapePlaylist(channelId.replace('UC', 'UUSH'));
    if (includeVideo)
      for (
        const videoId
        of await this.prisma.channel.findUniqueOrThrow({
          where: { id: channelId },
          select: {
            videos: {
              select: { id: true },
            },
          },
        }).then(channel => channel.videos.map(video => video.id))
      ) await this.service.updateVideo(videoId);
    return await this.getChannel(channelId);
  }

  @Get('/channel/:id/videos')
  async getChannelVideos(@Param('id') channelId: string) {
    return await this.prisma.channel.findUnique({
      where: { id: channelId },
      select: {
        videos: {
          select: { id: true },
        },
      },
    }).then(channel => stringify(channel?.videos.map(video => video.id) || null));
  }

  @Post('/channel/:id/about/fetch')
  async fetchChannelAbout(@Param('id') id: string) {
    await this.scraper.scrapeChannelAbout(id);
    return await this.getChannel(id);
  }

  @Get('/channel/:id/channels')
  async getChannelChannels(@Param('id') id: string) {
    return await this.prisma.channel.findUnique({
      where: { id },
      select: {
        channels: true,
      },
    }).then(channel => stringify(channel?.channels || null));
  }

  @Post('/channel/:id/featured/fetch')
  async fetchChannelFeatured(@Param('id') id: string) {
    await this.scraper.scrapeChannelFeatured(id);
    return await this.getChannel(id);
  }

  @Post('/channel/:id/fetchReleases')
  async fetchReleases(
    @Param('id') id: string,
  ) {
    await this.scraper.scrapeChannelReleasesTab(id);
    return await this.getChannel(id);
  }

  @Post('/channel/:id/fetchMembershipBadges')
  async fetchMembershipInfo(
    @Param('id') id: string,
    @Body() body: Record<string, string>,
  ) {
    await this.scraper.scrapeMembershipBadges(id, { headers: body });
    return await this.getChannel(id);
  }

  @Post('/channel/:id/fetchMembershipOffers')
  async fetchMembershipOffer(
    @Param('id') id: string,
    @Body() body: Record<string, string>,
  ) {
    await this.scraper.scrapeMembershipOffers(id, { headers: body });
    return await this.getChannel(id);
  }

  @Get('/channel/:channelId/communityPosts')
  async getCommunityPosts(
    @Param('channelId') channelId: string,
  ) {
    return await this.prisma.channel.findUnique({
      where: { id: channelId },
      select: {
        communityPosts: {
          select: { id: true },
        },
      },
    }).then(channel => stringify(channel?.communityPosts.map(post => post.id) || null));
  }

  @Get('/channel/:channelId/communityPosts/:postId')
  async getCommunityPostByChannelId(
    @Param('channelId') channelId: string,
    @Param('postId') postId: string,
  ) {
    return await this.prisma.channel.findUnique({
      where: { id: channelId },
      select: {
        communityPosts: {
          where: { id: postId }
        },
      },
    }).then(channel => stringify(channel?.communityPosts.at(0) || null));
  }

  @Post('/channel/:channelId/communityPosts/fetch')
  async fetchCommunityPosts(
    @Param('channelId') channelId: string,
  ) {
    await this.scraper.scrapeChannelCommunityTab(channelId);
    return await this.getCommunityPosts(channelId);
  }

  @Post('/communityPosts/:postId')
  async getCommunityPost(
    @Param('postId') postId: string,
  ) {
    return await this.prisma.communityPost.findUnique({
      where: { id: postId },
    }).then(post => stringify(post || null));
  }

}

function stringify(data: unknown) {
  return JSON.stringify(data, (key, value) => {
    if (typeof value === 'bigint')
      return value.toString();
    return value;
  });
}
