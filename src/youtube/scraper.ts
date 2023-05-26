import { Injectable } from '@nestjs/common';
import {
  getBasicInfo as _getBasicInfo,
} from 'ytdl-core';
import { AppHandleUpdate, Link } from './../app.handleUpdate';
import { parseSubscriberCount } from './../app.utils';
import { YoutubeApi } from './api';
import { Channel } from './types/export/channel';
import { extractErrorMessage, getChannelTab } from './helper';
import { Visibility } from '@prisma/client';

@Injectable()
export class YoutubeScraper {

  constructor(
    private youtube: YoutubeApi,
    private model: AppHandleUpdate,
  ) { }

  async scrapeVideo(videoId: string) {
    const {
      ytInitialPlayerResponse,
    } = await this.youtube.scrapeYoutubePage(`https://www.youtube.com/watch?v=${videoId}`);
    if (ytInitialPlayerResponse!.microformat?.playerMicroformatRenderer)
      await this.model.handlePlayerMicroformatRenderer(
        ytInitialPlayerResponse!.microformat.playerMicroformatRenderer,
      );
    const errorMessage = extractErrorMessage(ytInitialPlayerResponse!);
    if (
      errorMessage
      && ytInitialPlayerResponse!.playabilityStatus.errorScreen
        ?.playerLegacyDesktopYpcOfferRenderer?.offerId !== 'sponsors_only_video'
    ) await this.model.handleVideoUpdate({
      id: videoId,
      visibility: errorMessage.startsWith('This is a private video.')
        ? Visibility.private
        : undefined,
      removedReason: errorMessage,
    });
  }

  async scrapeChannelCommunityTab(channelId: string) {
    const {
      innertubeApiKey,
      ytInitialData,
    } = await this.youtube.scrapeYoutubePage(`https://www.youtube.com/channel/${channelId}/community`);
    const initialPosts = getChannelTab(ytInitialData, 'Community')
      .tabRenderer.content!.sectionListRenderer
      .contents[0].itemSectionRenderer.contents;
    for await (
      const { backstagePostThreadRenderer: { post } }
      of this.youtube.requestAll(innertubeApiKey, initialPosts)
    ) {
      const postId = 'backstagePostRenderer' in post
        ? post.backstagePostRenderer.postId
        : post.sharedPostRenderer.postId;
      await this.model.handleCommunityPostUpdate({
        id: postId,
        channelId,
      });
    }
  }

  async scrapeChannelFeatured(channelId: string) {
    const {
      ytInitialData,
    } = await this.youtube.scrapeYoutubePage(`https://www.youtube.com/channel/${channelId}/featured`);
    if (!ytInitialData.header)
      return;
    await this.model.handleC4TabbedHeaderRendererUpdate(ytInitialData.header.c4TabbedHeaderRenderer);
    const featuredDisplay = getChannelTab(ytInitialData, 'Home')
      .tabRenderer.content!.sectionListRenderer
      .contents.map<null | [string] | [string, string | string[]]>(content => {
        const item = content.itemSectionRenderer.contents[0];
        if ('channelFeaturedContentRenderer' in item)
          return [
            'live',
            item.channelFeaturedContentRenderer.items
              .map(item => item.videoRenderer.videoId),
          ];
        if ('channelVideoPlayerRenderer' in item)
          return [
            'featured',
            item.channelVideoPlayerRenderer.videoId,
          ];
        if ('recognitionShelfRenderer' in item)
          return ['membersRecognition'];
        if (
          'shelfRenderer' in item
          && item.shelfRenderer.endpoint.commandMetadata.webCommandMetadata
            .url.includes('/playlist?')
        ) return [
          'playlist',
          item.shelfRenderer.endpoint.browseEndpoint.browseId
            .replace(/^VL/, '')
        ];
        if (
          'shelfRenderer' in item
          && item.shelfRenderer.endpoint.commandMetadata.webCommandMetadata
            .url.includes('/playlists?')
        ) return [
          'playlists',
          item.shelfRenderer.title.runs[0].text,
        ];
        if (
          'shelfRenderer' in item
          && item.shelfRenderer.endpoint.commandMetadata.webCommandMetadata
            .url.includes('/channels?')
        ) return [
          'channels',
          item.shelfRenderer.title.runs[0].text,
        ];
        if (
          'shelfRenderer' in item
          && item.shelfRenderer.endpoint.commandMetadata.webCommandMetadata
            .url.includes('/videos?')
        ) return [
          'videos',
          item.shelfRenderer.title.runs[0].text,
        ];
        if ('reelShelfRenderer' in item)
          return ['shorts'];
        return null;
      });
    await this.model.handleChannelUpdate({
      id: ytInitialData.header.c4TabbedHeaderRenderer.channelId,
      featuredDisplay,
    });
    // for (const b of a) {
    //   if ('channelVideoPlayerRenderer' in b) {
    //     const viewCount = b.channelVideoPlayerRenderer.viewCountText.simpleText
    //       .split(' ')
    //       .at(0)
    //       ?.replace(/,/g, '');
    //     this.model.handleVideoUpdate({
    //       id: b.channelVideoPlayerRenderer.videoId,
    //       title: b.channelVideoPlayerRenderer.title.runs.at(0)?.text,
    //       viewCount: viewCount ? +viewCount : undefined,
    //       description: b.channelVideoPlayerRenderer.description.runs
    //         .map(run => run.text)
    //         .join(''),
    //     });
    //   }
    //   if ('shelfRenderer' in b) {
    //     this.model.handlePlaylistUpdate({
    //       id: b.shelfRenderer.endpoint.browseEndpoint.browseId.replace(/^VL/, ''),
    //       title: b.shelfRenderer.title.runs.at(0)?.text,
    //     });
    //     for (
    //       const { gridVideoRenderer }
    //       of b.shelfRenderer.content.horizontalListRenderer.items
    //     ) {
    //       this.model.handleChannelUpdate({
    //         id: gridVideoRenderer.shortBylineText.runs.at(0)!.navigationEndpoint.browseEndpoint.browseId,
    //         handle: gridVideoRenderer.shortBylineText.runs.at(0)!.navigationEndpoint.browseEndpoint.canonicalBaseUrl,
    //         name: gridVideoRenderer.shortBylineText.runs.at(0)!.text,
    //       });

    //     }
    //   }
    // }
  }

  async scrapeChannelMembership(channelId: string, headers?: Record<string, string>) {
    const {
      ytInitialData,
    } = await this.youtube.scrapeYoutubePage(`https://www.youtube.com/channel/${channelId}/membership`, {
      headers,
    });
    return {
      badges: <[months: number, url: string][]>getChannelTab(ytInitialData, 'Membership')
        ?.tabRenderer.content.sectionListRenderer.contents
        .find((content: any) => 'sponsorshipsExpandablePerksRenderer' in content)
        .sponsorshipsExpandablePerksRenderer.expandableItems[0]
        .sponsorshipsPerkRenderer.loyaltyBadges.sponsorshipsLoyaltyBadgesRenderer
        .loyaltyBadges.map((badge: any) => [
          +(badge.sponsorshipsLoyaltyBadgeRenderer.title.runs
            .map((run: any) => run.text).join('').match(/\d+/)?.[0] || 0),
          badge.sponsorshipsLoyaltyBadgeRenderer.icon.thumbnails[0].url.replace(/=[^]*$/, '=s0'),
        ]),
      emojis: <[name: string, url: string][]>getChannelTab(ytInitialData, 'Membership')
        ?.tabRenderer.content.sectionListRenderer.contents
        .find((content: any) => 'sponsorshipsExpandablePerksRenderer' in content)
        .sponsorshipsExpandablePerksRenderer.expandableItems[1]
        .sponsorshipsPerkRenderer.images.map((image: any) => [
          image.accessibility.accessibilityData.label,
          image.thumbnails[0].url.replace(/=[^]*$/, '=s0'),
        ]),
      banner: ytInitialData.header!.c4TabbedHeaderRenderer
        .banner!.thumbnails[0].url.replace(/=[^]*$/, '=s0'),
      avatar: ytInitialData.header!.c4TabbedHeaderRenderer
        .avatar.thumbnails[0].url.replace(/=[^]*$/, '=s0'),
    };
  }

  async scrapeChannelPlaylists(channelId: string) {
    const {
      innertubeApiKey,
      ytInitialData,
      // view === 58 // All playlists (with categories)
      // view === 1 // All playlists created
      // view === 50 // Specific category playlist
    } = await this.youtube.scrapeYoutubePage(`https://www.youtube.com/channel/${channelId}/playlists?view=58`);
    if (ytInitialData.header)
      await this.model.handleC4TabbedHeaderRendererUpdate(ytInitialData.header.c4TabbedHeaderRenderer);
    const categories = getChannelTab(ytInitialData, 'Playlists')
      .tabRenderer.content!.sectionListRenderer
      .subMenu.channelSubMenuRenderer.contentTypeSubMenuItems
      .filter((_, index, arr) => arr.length === 1 || index !== 0 ? true : false)
      .map((item) => [item.title, item.endpoint.browseEndpoint] as const);

    const playlistsDisplay: [string, string[]][] = [];
    for (const [title, { browseId, params }] of categories) {
      const initialItems = await this.youtube.request(innertubeApiKey, {
        browseId: browseId,
        params: params,
      }).then((res: Channel) => getChannelTab(res, 'Playlists')
        .tabRenderer.content!.sectionListRenderer.contents[0]
        .itemSectionRenderer.contents[0].gridRenderer!.items
      );
      const list: string[] = [];
      for await (
        const { gridPlaylistRenderer: playlist }
        of this.youtube.requestAll(innertubeApiKey, initialItems)
      ) {
        list.push(playlist.playlistId);
        this.model.handlePlaylistUpdate({
          channelId,
          id: playlist.playlistId,
          title: playlist.title.runs[0].text,
          estimatedCount: +playlist.videoCountShortText.simpleText,
        });
      }
      playlistsDisplay.push([title, list]);
    }
    await this.model.handleChannelUpdate({
      id: channelId,
      playlistsDisplay,
    });
  }

  async scrapeChannelAbout(channelId: string) {
    const {
      ytInitialData,
    } = await this.youtube.scrapeYoutubePage(`https://www.youtube.com/channel/${channelId}/about`);
    if (ytInitialData.header)
      await this.model.handleC4TabbedHeaderRendererUpdate(ytInitialData.header.c4TabbedHeaderRenderer);
    const metadata = getChannelTab(ytInitialData, 'About')
      .tabRenderer.content!.sectionListRenderer.contents[0]
      .itemSectionRenderer.contents[0].channelAboutFullMetadataRenderer;

    const viewCount = metadata.viewCountText.simpleText.split(' ').at(0)?.replace(/,/g, '');
    await this.model.handleChannelUpdate({
      id: metadata.channelId,
      viewCount: viewCount ? BigInt(viewCount) : undefined,
      description: metadata.description?.simpleText || null,
      avatarUrl: metadata.avatar.thumbnails.at(0)?.url,
      handle: metadata.canonicalChannelUrl.split('/').at(-1),
      haveBusinessEmail: 'signInForBusinessEmail' in metadata,
      location: metadata.country?.simpleText || null,
      name: metadata.title.simpleText,
      joinedAt: metadata.joinedDateText.runs[1].text,
      links: metadata.primaryLinks?.map(link => {
        const url = new URL(link.navigationEndpoint.urlEndpoint.url);
        return [
          link.title.simpleText,
          link.icon.thumbnails.at(-1)?.url || null,
          url.hostname === 'www.youtube.com' && url.pathname === '/redirect'
            ? url.searchParams.get('q')
            : url.href,
        ] as Link;
      }),
    });
  }

  async scrapeChannelChannels(channelId: string) {
    const {
      innertubeApiKey,
      ytInitialData,
      // view === 59 // All channels (show grid that got categorized)
      // view === 56 // Subscriptions
      // view === 49 // custom??
    } = await this.youtube.scrapeYoutubePage(`https://www.youtube.com/channel/${channelId}/channels?view=56`);
    if (ytInitialData.header)
      await this.model.handleC4TabbedHeaderRendererUpdate(ytInitialData.header.c4TabbedHeaderRenderer);
    const subMenu = getChannelTab(ytInitialData, 'Channels')
      .tabRenderer.content!.sectionListRenderer.subMenu;
    if (!subMenu)
      return await this.model.handleChannelUpdate({
        id: channelId,
        channels: [],
      });
    const categories = subMenu.channelSubMenuRenderer.contentTypeSubMenuItems
      .filter((_, index, arr) => arr.length === 1 || index !== 0 ? true : false)
      .map((item) => [item.title, item.endpoint.browseEndpoint] as const);

    const channels: [string, string[]][] = [];
    for (const [title, { browseId, params }] of categories) {
      const initialItems = await this.youtube.request(innertubeApiKey, {
        browseId: browseId,
        params: params,
      }).then((res: Channel) => {
        const tab = getChannelTab(res, 'Channels');
        if (
          categories.length !== 1 &&
          tab.tabRenderer.content!.sectionListRenderer.subMenu
            ?.channelSubMenuRenderer.contentTypeSubMenuItems[0]
            .selected
        ) return [];
        return tab
          .tabRenderer.content!.sectionListRenderer.contents[0]
          .itemSectionRenderer.contents[0].gridRenderer!.items
      });
      const list: string[] = [];
      for await (
        const { gridChannelRenderer: data }
        of this.youtube.requestAll(innertubeApiKey, initialItems)
      ) {
        list.push(data.channelId);
        const verifiedBadgeIndex = data.ownerBadges
          ?.findIndex(badge => badge.metadataBadgeRenderer.icon.iconType === 'CHECK_CIRCLE_THICK');
        this.model.handleChannelUpdate({
          id: data.channelId,
          avatarUrl: data.thumbnail.thumbnails.at(-1)?.url,
          handle: data.navigationEndpoint.browseEndpoint.canonicalBaseUrl,
          name: data.title.simpleText,
          verified: verifiedBadgeIndex === undefined ? undefined : verifiedBadgeIndex !== -1,
          // what if no sub??
          subscriberCount: parseSubscriberCount(data.subscriberCountText.simpleText.split(' ')[0]),
        });
      }
      channels.push([title, list]);
    }
    await this.model.handleChannelUpdate({
      id: channelId,
      channels,
    });
  }

}

let mutex: Promise<void> = Promise.resolve();
async function getBasicInfo(
  ...args: Parameters<typeof _getBasicInfo>
): ReturnType<typeof _getBasicInfo> {
  let resolve: (value?: unknown) => void;
  const newMutex = new Promise<void>(rs => resolve = rs);
  const oldMutex = mutex;
  mutex = newMutex;
  await oldMutex;
  return await _getBasicInfo(...args)
    .finally(() => resolve());
}
