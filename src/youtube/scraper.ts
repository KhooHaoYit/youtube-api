import { Injectable } from '@nestjs/common';
import { AppHandleUpdate } from './../app.handleUpdate';
import { YoutubeApi } from './api';
import { getChannelTab } from './helper';
import { Visibility } from '@prisma/client';
import { getPost } from './types/export/renderer/backstagePostThreadRenderer';
import { getCommunityPosts } from './types/export/url/channelTab/community';
import { getErrorMessage } from './types/export/url/watch';
import { getAllRelatedChannel, getAllRelatedPlaylists, getFeaturedDisplay } from './types/export/url/channelTab/home';
import { getPlaylist, getUnviewableReason, hasPlaylist } from './types/export/url/playlist';
import { getVideoInfo } from './types/export/renderer/playlistVideoRenderer';
import { PrismaService } from 'nestjs-prisma';
import { getCurrentPerksInfo } from './types/export/renderer/sponsorshipsExpandablePerksRenderer';
import { getOffer } from './types/export/endpoints/getOffer';
import * as ypcTransactionErrorMessageRenderer from './types/export/renderer/ypcTransactionErrorMessageRenderer';
import { getOfferInfo } from './types/export/renderer/sponsorshipsOfferRenderer';
import { browseAll, browsePlaylist } from './types/export/endpoints/browse';
import { listAllVideos } from './types/export/generic/playlistItemSection';
import { getChannelInfo } from './types/export/generic/models/aboutChannelViewModel';
import { getOriginalText } from './types/export/generic/text';
import { getPlaylistInfo } from './types/export/renderer/playlistRenderer';

@Injectable()
export class YoutubeScraper {

  constructor(
    private youtube: YoutubeApi,
    private model: AppHandleUpdate,
    private prisma: PrismaService,
  ) { }

  async scrapeVideo(videoId: string) { // TODO: save recommended video
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
    if (!hasPlaylist(page)) {
      const unviewableReason = getUnviewableReason(page);
      if (!unviewableReason)
        return;
      await this.model.handlePlaylistUpdate({
        id: playlistId,
        unviewableReason,
      });
      return;
    }
    if (!page.innertubeApiKey)
      throw new Error(`innertubeApiKey not defined`);
    const browsedPlaylist = await browsePlaylist(playlistId);
    const videoIds: string[] = [];
    const items = browsedPlaylist
      .contents.twoColumnBrowseResultsRenderer.tabs[0]
      .tabRenderer.content.sectionListRenderer.contents;
    const seasons = items[0].itemSectionRenderer.contents[0]
      .playlistShowMetadataRenderer?.collection.sortFilterSubMenuRenderer
      .subMenuItems.map(item => [
        item.title,
        item.navigationEndpoint.browseEndpoint!.browseId
          .replace(/^VL/, ''),
      ] satisfies [any, any]);
    for await (
      const { video, shorts }
      of listAllVideos(
        items.at(1)?.itemSectionRenderer ?? items[0].itemSectionRenderer,
        page.innertubeApiKey,
      )
    ) {
      const videoId = video?.videoId ?? shorts!.entityId.replace('shorts-shelf-item-', '');
      videoIds.push(videoId);
      if (shorts) {
        await this.scrapeVideo(videoId);
        continue;
      }
      await this.model.handleVideoUpdate({
        id: video!.videoId,
        channelId: getVideoInfo(video!).ownerId,
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
      badges: playlist.badges,
      videoIds,
      seasons,
    });
  }

  async scrapeChannelReleasesTab(channelId: string) {
    const page = await this.youtube.scrape(`/channel/${channelId}/releases`);
    if (!page.innertubeApiKey)
      throw new Error(`innertubeApiKey not defined`);
    const tab = getChannelTab(page.ytInitialData!, 'Releases');
    if (!tab)
      return;
    const initialReleases = tab.tabRenderer.content?.richGridRenderer.contents;
    const releases = [];
    for await (
      const { richItemRenderer }
      of browseAll(page.innertubeApiKey, initialReleases)
    ) {
      const playlist = getPlaylistInfo(richItemRenderer!.content.playlistRenderer);
      releases.push(playlist.id);
      await this.model.handlePlaylistUpdate({
        id: playlist.id,
        extraChannelIds: playlist.extraChannelIds,
      });
    }
    await this.model.handleChannelUpdate({
      id: channelId,
      releases,
    });
  }

  async scrapeChannelCommunityTab(channelId: string) {
    const page = await this.youtube.scrape(`/channel/${channelId}/community`);
    if (!page.innertubeApiKey)
      throw new Error(`innertubeApiKey not defined`);
    const tab = getChannelTab(page.ytInitialData!, 'Posts');
    if (!tab)
      return;
    const initialPosts = getCommunityPosts(tab.tabRenderer);
    for await (
      const { backstagePostThreadRenderer }
      of browseAll(page.innertubeApiKey, initialPosts)
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
    if (!page.innertubeApiKey)
      throw new Error('Unable to extract innertubeApiKey');
    if (page.ytInitialData.header.c4TabbedHeaderRenderer) {
      await this.model.handleC4TabbedHeaderRendererUpdate(page.ytInitialData.header.c4TabbedHeaderRenderer);
    }
    const tab = getChannelTab(page.ytInitialData!, 'Home').tabRenderer;
    await this.model.handleChannelUpdate({
      id: channelId,
      featuredDisplay: getFeaturedDisplay(tab),
      channels: await getAllRelatedChannel(page.innertubeApiKey, tab, channelId),
      playlistsDisplay: await getAllRelatedPlaylists(page.innertubeApiKey, tab, channelId),
    });
  }

  async scrapeChannelPlaylists(channelId: string) {
    // view === 58 // All playlists (with categories)
    // view === 1 // All playlists created
    // view === 50 // Specific category playlist
    const page = await this.youtube.scrape(`/channel/${channelId}/playlists`);
    if (!page.innertubeApiKey)
      throw new Error(`innertubeApiKey not defined`);
    const initialItems = getChannelTab(page.ytInitialData!, 'Playlists')
      ?.tabRenderer.content?.sectionListRenderer.contents[0]
      .itemSectionRenderer.contents[0].gridRenderer?.items;
    if (!initialItems) // channel have no playlist??
      return;
    for await (
      const { gridPlaylistRenderer, gridShowRenderer, lockupViewModel }
      of browseAll(page.innertubeApiKey, initialItems)
    ) {
      const id = gridPlaylistRenderer?.playlistId
        ?? gridShowRenderer?.navigationEndpoint.browseEndpoint?.browseId.replace(/^VL/, '')
        ?? lockupViewModel?.contentId;
      if (!id)
        throw new Error(`Unable to extract playlistId`);
      const title = getOriginalText(
        gridPlaylistRenderer?.title
        ?? gridShowRenderer?.title
        ?? lockupViewModel?.metadata.lockupMetadataViewModel.title!
      );
      let estimatedCount = +(
        lockupViewModel?.contentImage.collectionThumbnailViewModel.primaryThumbnail.thumbnailViewModel.overlays
          .find(item => item.thumbnailOverlayBadgeViewModel)!.thumbnailOverlayBadgeViewModel
          ?.thumbnailBadges[0].thumbnailBadgeViewModel.text.split(' ')[0]!
        ?? getOriginalText(
          gridPlaylistRenderer?.videoCountShortText
          ?? gridShowRenderer?.thumbnailOverlays[0].thumbnailOverlayBottomPanelRenderer.text!
        ).replace(/,| [^]+/g, '')
      );
      await this.model.handlePlaylistUpdate({
        channelId,
        id,
        title,
        estimatedCount,
      });
    }
  }

  async scrapeChannelAbout(channelId: string) {
    const page = await this.youtube.scrape(`/channel/${channelId}/about`);
    if (page.ytInitialData?.header?.c4TabbedHeaderRenderer)
      await this.model.handleC4TabbedHeaderRendererUpdate(page.ytInitialData.header.c4TabbedHeaderRenderer);
    const about = page.ytInitialData?.onResponseReceivedEndpoints?.[0].showEngagementPanelEndpoint
      ?.engagementPanel.engagementPanelSectionListRenderer.content.sectionListRenderer
      .contents[0].itemSectionRenderer.contents[0].aboutChannelRenderer.metadata.aboutChannelViewModel;
    if (!about)
      throw new Error('Unable to fetch channel about');
    const channelInfo = getChannelInfo(about);
    await this.model.handleChannelUpdate({
      id: channelInfo.channelId,
      bannerUrl: page.ytInitialData?.header?.pageHeaderRenderer?.content
        .pageHeaderViewModel.banner?.imageBannerViewModel.image.sources[0].url,
      viewCount: channelInfo.viewCount,
      description: channelInfo.description,
      handle: channelInfo.handle,
      haveBusinessEmail: channelInfo.haveBusinessEmail,
      location: channelInfo.country,
      joinedAt: channelInfo.joinedAt,
      links: channelInfo.links,
      artistBio: channelInfo.artistBio,
    });
  }

  // TODO: estimate total amount of members from emojis, https://support.google.com/youtube/answer/7544492?hl=en#zippy=%2Cupload-custom-emoji%2Cnumber-of-custom-emoji-you-can-upload:~:text=Number%20of%20custom%20emoji%20you%20can%20upload
  async scrapeMembershipOffers(
    channelId: string,
    options?: {
      headers?: {
        cookie?: string,
        authorization?: string,
      },
    },
  ) {
    const offer = await getOffer({ channelId }, options?.headers!);
    if (offer.error)
      if (offer.error.code === 404)
        return;
      else throw new Error(offer.error.message)
    const { popup } = offer.actions![0].openPopupAction;
    if (popup.ypcTransactionErrorMessageRenderer)
      throw new Error(ypcTransactionErrorMessageRenderer
        .getErrorMessage(popup.ypcTransactionErrorMessageRenderer!));
    await this.model.handleChannelUpdate({
      id: channelId,
      membershipOffers: getOfferInfo(popup.sponsorshipsOfferRenderer!),
    });
  }

  async scrapeMembershipBadges(
    channelId: string,
    options?: {
      headers?: Record<string, string>
    },
  ) {
    const page = await this.youtube.scrape(`/channel/${channelId}/membership`, {
      headers: options?.headers,
    });
    const perks = getCurrentPerksInfo(
      getChannelTab(page.ytInitialData!, 'Membership')!
        .tabRenderer.content!.sectionListRenderer.contents
        .find(content => content.sponsorshipsExpandablePerksRenderer)!
        .sponsorshipsExpandablePerksRenderer!
    );
    await this.model.handleChannelUpdate({
      id: channelId,
      membershipBadges: perks.badges,
    });
  }

}
