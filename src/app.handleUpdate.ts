import { Injectable } from '@nestjs/common';
import { Prisma, Visibility } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { prismaUpsertRetry } from './app.utils';
import { C4TabbedHeaderRenderer } from './youtube/types/export/renderer/c4TabbedHeaderRenderer';
import * as c4TabbedHeaderRenderer from './youtube/types/export/renderer/c4TabbedHeaderRenderer';
import * as playerMicroformatRenderer from './youtube/types/export/renderer/playerMicroformatRenderer';
import type { PlayerMicroformatRenderer } from './youtube/types/export/renderer/playerMicroformatRenderer';
import { Link } from './youtube/types/export/renderer/channelAboutFullMetadataRenderer';
import { getPost } from './youtube/types/export/renderer/backstagePostThreadRenderer';

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
      handle: playerMicroformatRenderer.getHandle(data),
    }, fetchedAt);
    await this.handleVideoUpdate({
      id: playerMicroformatRenderer.getVideoId(data),
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
    await this.handleChannelUpdate({
      id: c4TabbedHeaderRenderer.getChannelId(data),
      bannerUrl: c4TabbedHeaderRenderer.getBannerUrl(data),
      avatarUrl: c4TabbedHeaderRenderer.getAvatarUrl(data),
      name: c4TabbedHeaderRenderer.getChannelName(data),
      handle: c4TabbedHeaderRenderer.getHandle(data),
      subscriberCount: c4TabbedHeaderRenderer.getSubscriberCount(data),
      verified: c4TabbedHeaderRenderer.isVerified(data),
      haveMembershipFeature: c4TabbedHeaderRenderer.haveMembershipFeature(data),
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
    const newData = await removeSame(this.prisma.channel, data);
    if (!newData)
      return;
    data = newData;
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
      select: { id: true },
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
    const newData = await removeSame(this.prisma.video, data);
    if (!newData)
      return;
    data = newData;
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
      select: { id: true },
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
    const newData = await removeSame(this.prisma.playlist, data);
    if (!newData)
      return;
    data = newData;
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
      select: { id: true },
    });
  }

  async handleCommunityPostUpdate(
    data: {
      id: string,
      channelId?: string,
      content?: string,
      extra?: ReturnType<typeof getPost>['extra'],
      likeCount?: number,
      replyCount?: number,
      publishedTime?: string,
    },
    fetchedAt = new Date,
  ) {
    const fields = {
      ...data,
      extra: data.extra === null
        ? Prisma.DbNull
        : data.extra,
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
      select: { id: true },
    });
  }

}

// prewrite
async function removeSame(modal: any, data: any) {
  const dbData = await modal.findUnique({
    where: { id: data.id },
    select: {
      id: undefined,
      ...Object.fromEntries(Object.entries(data).map(entry => {
        entry[1] = entry[1] === undefined ? false : true;
        return entry;
      })),
    },
  });
  if (!dbData)
    return data;
  data = structuredClone(data);
  for (const key in data) {
    if (key === 'id')
      continue;
    const value = data[key as keyof typeof data];
    const dbValue = dbData[key as keyof typeof dbData];
    if (value !== dbValue) {
      if (typeof value !== 'object')
        continue;
      if (JSON.stringify(value) !== JSON.stringify(dbValue))
        continue;
    }
    delete data[key as keyof typeof data];
  }
  if (Object.keys(data).length === 1)
    return null;
  return data;
}

// const cache = new Map<string, Record<string, any>>();
// const func = async (modal: any, data: any) => {
//   const output = {} as Record<string, Promise<any>>;
//   const currentCache = cache.get(data.id) ?? cache.set(data.id, {}) as any;

//   const fetchFromDb = {} as Record<string, any>;
//   for (const key in data) {
//     let resolve;
//     const promise = new Promise(rs => resolve = rs)
//       .finally(async () => {
//         await new Promise(rs => setTimeout(rs, 60_000));
//         delete currentCache[key];
//         if (Object.keys(currentCache).length)
//           return;
//         cache.delete(data.id);
//       });
//     output[key]
//       = currentCache[key]
//       = promise;
//     fetchFromDb[key] = resolve;
//   }
//   const result = await modal.findUnique({
//     where: { id: data.id },
//     select: Object.fromEntries(
//       Object.keys(fetchFromDb)
//         .map(k => [k, true])
//     ),
//   });
//   if (!result)
//     return null;
//   for (const key in result)
//     fetchFromDb[key](result[key]);

//   const entries = await Promise.all(
//     Object.entries(output)
//       .map(async ([k, v]) => [k, await v])
//   );
//   return Object.fromEntries(entries);
// }
