import { Injectable } from '@nestjs/common';
import { AppHandleUpdate } from './../app.handleUpdate';
import { YoutubeApi } from './api';
import { getChannelTab } from './helper';
import { Visibility } from '@prisma/client';
import { getPost } from './types/export/renderer/backstagePostThreadRenderer';
import * as gridChannelRenderer from './types/export/renderer/gridChannelRenderer';
import { getAmountOfVideos, getPlaylistId, getPlaylistTitle } from './types/export/renderer/gridPlaylistRenderer';
import { getLinks } from './types/export/renderer/channelAboutFullMetadataRenderer';
import { getViewCount } from './types/export/renderer/channelAboutFullMetadataRenderer';
import { getPlaylists } from './types/export/url/channelTab/playlists';
import { Channel } from './types/export/url/channel';
import { getCommunityPosts } from './types/export/url/channelTab/community';
import { getErrorMessage } from './types/export/url/watch';
import { getFeaturedDisplay } from './types/export/url/channelTab/home';
import { getPlaylist, hasPlaylist, listAllVideos } from './types/export/url/playlist';
import { getChannelId } from './types/export/renderer/playlistVideoRenderer';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class YoutubeScraper {

  constructor(
    private youtube: YoutubeApi,
    private model: AppHandleUpdate,
    private prisma: PrismaService,
  ) { }

  async scrapeVideo(videoId: string) {
    const page = await this.youtube.scrape(`/watch?v=${videoId}`);
    if (page.ytInitialPlayerResponse!.microformat?.playerMicroformatRenderer)
      await this.model.handlePlayerMicroformatRenderer(
        page.ytInitialPlayerResponse!.microformat.playerMicroformatRenderer,
      );
    const errorMessage = getErrorMessage(page);
    if (
      errorMessage
      && page.ytInitialPlayerResponse!.playabilityStatus.errorScreen
        ?.playerLegacyDesktopYpcOfferRenderer?.offerId !== 'sponsors_only_video'
    ) await this.model.handleVideoUpdate({
      id: videoId,
      visibility: errorMessage.startsWith('This is a private video.')
        ? Visibility.private
        : undefined,
      removedReason: errorMessage,
    });
  }

  async scrapePlaylist(playlistId: string) {
    const page = await this.youtube.scrape(`/playlist?list=${playlistId}`);
    if (!hasPlaylist(page))
      return;
    if (!page.innertubeApiKey)
      throw new Error(`innertubeApiKey not defined`);
    const videoIds: string[] = [];
    for await (const { video, shorts } of listAllVideos(page, page.innertubeApiKey)) {
      videoIds.push((video ?? shorts!).videoId);
      if (shorts) {
        await this.scrapeVideo(shorts.videoId);
        continue;
      }
      await this.model.handleVideoUpdate({
        id: video!.videoId,
        channelId: getChannelId(video!),
      });
    }
    const playlist = getPlaylist(page);
    await this.model.handlePlaylistUpdate({
      id: playlist.id,
      channelId: playlist.channelId,
      description: playlist.description,
      estimatedCount: playlist.videoCount,
      lastUpdated: playlist.lastUpdated,
      title: playlist.title,
      view: playlist.viewCount,
      visibility: playlist.visibility,
      videoIds,
    });
  }

  async scrapeChannelCommunityTab(channelId: string) {
    const page = await this.youtube.scrape(`/channel/${channelId}/community`);
    if (!page.innertubeApiKey)
      throw new Error(`innertubeApiKey not defined`);
    const initialPosts = getCommunityPosts(
      getChannelTab(page.ytInitialData!, 'Community')
        .tabRenderer,
    );
    for await (
      const { backstagePostThreadRenderer }
      of this.youtube.requestAll(page.innertubeApiKey, initialPosts)
    ) {
      const post = getPost(backstagePostThreadRenderer!);
      if (post.extra?.[0] === 'share' && post.extra[1] === null) {
        const originalPostId = await this.prisma.communityPost.findUnique({
          where: { id: post.postId },
          select: { extra: true },
        }).then(res => (<typeof post.extra>res?.extra)?.[1]);
        if (originalPostId)
          post.extra[1] = originalPostId;
      }
      await this.model.handleCommunityPostUpdate({
        id: post.postId,
        channelId,
        content: post.content,
        extra: post.extra,
        likeCount: post.likeCount,
        replyCount: post.replyCount,
        publishedTime: post.publishedTime,
      });
    }
  }

  async scrapeChannelFeatured(channelId: string) {
    const page = await this.youtube.scrape(`/channel/${channelId}/featured`);
    if (!page.ytInitialData?.header)
      return;
    await this.model.handleC4TabbedHeaderRendererUpdate(page.ytInitialData.header.c4TabbedHeaderRenderer);
    await this.model.handleChannelUpdate({
      id: page.ytInitialData.header.c4TabbedHeaderRenderer.channelId,
      featuredDisplay: getFeaturedDisplay(
        getChannelTab(page.ytInitialData!, 'Home').tabRenderer
      ),
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
    const page = await this.youtube.scrape(`/channel/${channelId}/membership`, {
      headers,
    });
    return {
      badges: <[months: number, url: string][]>getChannelTab(page.ytInitialData!, 'Membership')
        ?.tabRenderer.content.sectionListRenderer.contents
        .find((content: any) => 'sponsorshipsExpandablePerksRenderer' in content)
        .sponsorshipsExpandablePerksRenderer.expandableItems[0]
        .sponsorshipsPerkRenderer.loyaltyBadges.sponsorshipsLoyaltyBadgesRenderer
        .loyaltyBadges.map((badge: any) => [
          +(badge.sponsorshipsLoyaltyBadgeRenderer.title.runs
            .map((run: any) => run.text).join('').match(/\d+/)?.[0] || 0),
          badge.sponsorshipsLoyaltyBadgeRenderer.icon.thumbnails[0].url.replace(/=[^]*$/, '=s0'),
        ]),
      emojis: <[name: string, url: string][]>getChannelTab(page.ytInitialData!, 'Membership')
        ?.tabRenderer.content.sectionListRenderer.contents
        .find((content: any) => 'sponsorshipsExpandablePerksRenderer' in content)
        .sponsorshipsExpandablePerksRenderer.expandableItems[1]
        .sponsorshipsPerkRenderer.images.map((image: any) => [
          image.accessibility.accessibilityData.label,
          image.thumbnails[0].url.replace(/=[^]*$/, '=s0'),
        ]),
      banner: page.ytInitialData!.header!.c4TabbedHeaderRenderer
        .banner!.thumbnails[0].url.replace(/=[^]*$/, '=s0'),
      avatar: page.ytInitialData!.header!.c4TabbedHeaderRenderer
        .avatar.thumbnails[0].url.replace(/=[^]*$/, '=s0'),
    };
  }

  async scrapeChannelPlaylists(channelId: string) {
    // view === 58 // All playlists (with categories)
    // view === 1 // All playlists created
    // view === 50 // Specific category playlist
    const page = await this.youtube.scrape(`/channel/${channelId}/playlists?view=58`);
    if (page.ytInitialData?.header)
      await this.model.handleC4TabbedHeaderRendererUpdate(page.ytInitialData.header.c4TabbedHeaderRenderer);
    if (!page.innertubeApiKey)
      throw new Error(`innertubeApiKey not defined`);
    const categories = getPlaylists(
      getChannelTab(page.ytInitialData!, 'Playlists')
        .tabRenderer,
    ).subMenu;

    const playlistsDisplay: [string, string[]][] = [];
    for (const [title, { browseId, params }] of categories) {
      const initialItems = await this.youtube.request(page.innertubeApiKey, {
        browseId: browseId,
        params: params,
      }).then((res: Channel['ytInitialData']) =>
        getPlaylists(
          getChannelTab(res!, 'Playlists')
            .tabRenderer,
        ).playlists,
      );
      const list: string[] = [];
      for await (
        const { gridPlaylistRenderer: playlist }
        of this.youtube.requestAll(page.innertubeApiKey, initialItems)
      ) {
        list.push(playlist.playlistId);
        this.model.handlePlaylistUpdate({
          channelId,
          id: getPlaylistId(playlist),
          title: getPlaylistTitle(playlist),
          estimatedCount: getAmountOfVideos(playlist),
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
    const page = await this.youtube.scrape(`/channel/${channelId}/about`);
    if (page.ytInitialData?.header)
      await this.model.handleC4TabbedHeaderRendererUpdate(page.ytInitialData.header.c4TabbedHeaderRenderer);
    const metadata = getChannelTab(page.ytInitialData!, 'About')
      .tabRenderer.content!.sectionListRenderer.contents[0]
      .itemSectionRenderer.contents[0].channelAboutFullMetadataRenderer;

    const viewCount = getViewCount(metadata);
    await this.model.handleChannelUpdate({
      id: metadata.channelId,
      viewCount: viewCount ? BigInt(viewCount) : 0n,
      description: metadata.description?.simpleText || null,
      avatarUrl: metadata.avatar.thumbnails.at(0)?.url,
      handle: metadata.canonicalChannelUrl.split('/').at(-1),
      haveBusinessEmail: 'signInForBusinessEmail' in metadata,
      location: metadata.country?.simpleText || null,
      name: metadata.title.simpleText,
      joinedAt: metadata.joinedDateText.runs[1].text,
      links: getLinks(metadata),
    });
  }

  async scrapeChannelChannels(channelId: string) {
    // view === 59 // All channels (show grid that got categorized)
    // view === 56 // Subscriptions
    // view === 49 // custom??
    const page = await this.youtube.scrape(`/channel/${channelId}/channels?view=56`);
    if (!page.innertubeApiKey)
      throw new Error(`innertubeApiKey not defined`);
    if (page.ytInitialData?.header)
      await this.model.handleC4TabbedHeaderRendererUpdate(page.ytInitialData.header.c4TabbedHeaderRenderer);
    const subMenu = getChannelTab(page.ytInitialData!, 'Channels')
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
      const initialItems = await this.youtube.request(page.innertubeApiKey, {
        browseId: browseId,
        params: params,
      }).then((res: Channel['ytInitialData']) => {
        const tab = getChannelTab(res!, 'Channels');
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
        const { gridChannelRenderer: renderer }
        of this.youtube.requestAll(page.innertubeApiKey, initialItems)
      ) {
        const data = renderer!;
        list.push(data.channelId);
        const verifiedBadgeIndex = data.ownerBadges
          ?.findIndex(badge => badge.metadataBadgeRenderer.icon.iconType === 'CHECK_CIRCLE_THICK');
        this.model.handleChannelUpdate({
          id: gridChannelRenderer.getChannelId(data),
          avatarUrl: gridChannelRenderer.getChannelAvatarUrl(data),
          handle: gridChannelRenderer.getChannelHandle(data),
          name: data.title.simpleText,
          verified: verifiedBadgeIndex === undefined ? undefined : verifiedBadgeIndex !== -1,
          subscriberCount: gridChannelRenderer.getSubscriberCount(data),
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
