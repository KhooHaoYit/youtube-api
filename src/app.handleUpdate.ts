import { Injectable } from '@nestjs/common';
import { Visibility } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import {
  getBasicInfo as _getBasicInfo,
} from 'ytdl-core';
import { parseSubscriberCount, prismaUpsertRetry } from './app.utils';
import { C4TabbedHeaderRenderer } from './youtube/types/export/c4TabbedHeaderRenderer';
import { PlayerMicroformatRenderer } from './youtube/types/export/playerMicroformatRenderer';

@Injectable()
export class AppHandleUpdate {

  constructor(
    private prisma: PrismaService,
  ) { }

  async handlePlayerMicroformatRenderer(
    data: PlayerMicroformatRenderer,
    fetchedAt = new Date,
  ) {
    await this.handleChannelUpdate({
      id: data.externalChannelId,
      name: data.ownerChannelName,
      handle: data.ownerProfileUrl.split('/').at(-1),
    }, fetchedAt);
    await this.handleVideoUpdate({
      id: data.thumbnail.thumbnails.at(0)!.url
        .replace(/^[^]+?vi\//, '')
        .replace(/\/[^]+$/, ''),
      category: data.category,
      viewCount: data.viewCount ? +data.viewCount : undefined,
      description: data.description?.simpleText || '',
      uploadDate: data.uploadDate,
      publishDate: data.publishDate,
      channelId: data.externalChannelId,
      duration: +data.lengthSeconds,
      title: data.title.simpleText,
      isLivestream: !!data.liveBroadcastDetails,
      liveStartTimestamp: data.liveBroadcastDetails?.startTimestamp,
      liveEndTimestamp: data.liveBroadcastDetails?.endTimestamp,
      visibility: data.isUnlisted
        ? Visibility.unlisted
        : Visibility.public,
    }, fetchedAt);
  }

  async handleC4TabbedHeaderRendererUpdate(
    data: C4TabbedHeaderRenderer,
    fetchedAt = new Date,
  ) {
    const verifiedBadgeIndex = data.badges
      ?.findIndex(badge => badge.metadataBadgeRenderer.icon.iconType === 'CHECK_CIRCLE_THICK');
    await this.handleChannelUpdate({
      id: data.channelId,
      bannerUrl: data.banner?.thumbnails.at(0)?.url,
      avatarUrl: data.avatar.thumbnails.at(0)?.url,
      name: data.title,
      handle: data.channelHandleText?.runs.at(0)?.text,
      subscriberCount: parseSubscriberCount(data.subscriberCountText?.simpleText.split(' ').at(0)),
      verified: verifiedBadgeIndex === undefined ? undefined : verifiedBadgeIndex !== -1,
      haveMembershipFeature: 'sponsorButton' in data,
      links: [
        data.headerLinks?.channelHeaderLinksRenderer.primaryLinks || [],
        data.headerLinks?.channelHeaderLinksRenderer.secondaryLinks || [],
      ].flat()
        .map(link => {
          const url = new URL(link.navigationEndpoint.urlEndpoint.url);
          return [
            link.title.simpleText,
            link.icon.thumbnails.at(-1)?.url || null,
            url.hostname === 'www.youtube.com' && url.pathname === '/redirect'
              ? url.searchParams.get('q')
              : url.href,
          ] as Link;
        }),
    }, fetchedAt);
  }

  async handleChannelUpdate(
    data: {
      // should save total videos in public?? (it might return optional from api)
      id: string,
      subscriberCount?: number,
      viewCount?: bigint,
      name?: string,
      handle?: string,
      avatarUrl?: string,
      channels?: [string, string[]][],
      playlistsDisplay?: [string, string[]][],
      featuredDisplay?: (null | [string] | [string, string | string[]])[],
      bannerUrl?: string,
      description?: string | null,
      location?: string | null,
      joinedAt?: string,
      links?: Link[],
      verified?: boolean,
      haveMembershipFeature?: boolean,
      haveBusinessEmail?: boolean,
    },
    fetchedAt = new Date,
  ) {
    const fields = {
      ...data,
      handle: data.handle
        ?.replace(/^\/?@/, ''),
      avatarUrl: data.avatarUrl
        ?.replace(/=[^]*$/, '=s0')
        .replace(/^\/\//, 'https://'),
      bannerUrl: data.bannerUrl
        ?.replace(/=[^]*$/, '=s0')
        .replace(/^\/\//, 'https://'),
      i_fetchedAt: fetchedAt,
    };
    await prismaUpsertRetry(this.prisma.channel, {
      where: { id: data.id },
      create: fields,
      update: fields,
    });
  }
  // https://i.ytimg.com/an/otXwY6s8pWmuWd_snKYjhg/featured_channel.jpg
  async handleVideoUpdate(
    data: {
      id: string,
      channelId?: string,
      visibility?: Visibility,
      removedReason?: string,
      title?: string,
      description?: string | null,
      liveStartTimestamp?: string,
      liveEndTimestamp?: string,
      viewCount?: number,
      uploadDate?: string,
      category?: string,
      duration?: number,
      keywords?: string[],
      publishDate?: string,
      isLivestream?: boolean,
      isMembershipContent?: boolean,
      isAgeRestricted?: boolean,
    },
    fetchedAt = new Date,
  ) {
    const fields = {
      ...data,
      channelId: undefined,
      channel: !data.channelId ? undefined : {
        connectOrCreate: {
          create: { id: data.channelId },
          where: { id: data.channelId },
        },
      },
      i_fetchedAt: fetchedAt,
    };
    await prismaUpsertRetry(this.prisma.video, {
      where: { id: data.id },
      create: fields,
      update: fields,
    });
  }

  async handlePlaylistUpdate(
    data: {
      id: string,
      channelId?: string,
      description?: string,
      estimatedCount?: number,
      lastUpdated?: string,
      title?: string,
      videoIds?: string[],
      view?: number,
      visibility?: string,
    },
    fetchedAt = new Date,
  ) {
    const fields = {
      ...data,
      channelId: undefined,
      channel: !data.channelId ? undefined : {
        connectOrCreate: {
          create: { id: data.channelId },
          where: { id: data.channelId },
        },
      },
      i_fetchedAt: fetchedAt,
    };
    await prismaUpsertRetry(this.prisma.playlist, {
      where: { id: data.id },
      create: fields,
      update: fields,
    });
  }

  async handleCommunityPostUpdate(
    data: {
      id: string,
      channelId?: string,
    },
    fetchedAt = new Date,
  ) {
    const fields = {
      ...data,
      channelId: undefined,
      channel: !data.channelId ? undefined : {
        connectOrCreate: {
          create: { id: data.channelId },
          where: { id: data.channelId },
        },
      },
      i_fetchedAt: fetchedAt,
    };
    await prismaUpsertRetry(this.prisma.communityPost, {
      where: { id: data.id },
      create: fields,
      update: fields,
    });
  }

}

export type Link = [title: string, iconUrl: string | null, url: string | null];
