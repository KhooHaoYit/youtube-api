import { getChannelTab } from "src/youtube/helper";
import { browseAll, browseChannelPlaylists, browseChannelSubs } from "../../endpoints/browse";
import { NavigationEndpoint } from "../../generic/navigationEndpoint";
import { Text, getOriginalText } from "../../generic/text";
import { ChannelFeaturedContentRenderer } from "../../renderer/channelFeaturedContentRenderer";
import * as channelFeaturedContentRenderer from "../../renderer/channelFeaturedContentRenderer";
import { ChannelOwnerEmptyStateRenderer } from "../../renderer/channelOwnerEmptyStateRenderer";
import { ChannelRenderer } from "../../renderer/channelRenderer";
import { ChannelVideoPlayerRenderer } from "../../renderer/channelVideoPlayerRenderer";
import * as channelVideoPlayerRenderer from "../../renderer/channelVideoPlayerRenderer";
import { ExpandedShelfContentsRenderer } from "../../renderer/expandedShelfContentsRenderer";
import { GridChannelRenderer } from "../../renderer/gridChannelRenderer";
import { GridPlaylistRenderer } from "../../renderer/gridPlaylistRenderer";
import { GridVideoRenderer } from "../../renderer/gridVideoRenderer";
import { ItemSectionRenderer } from "../../renderer/itemSectionRenderer";
import { MessageRenderer } from "../../renderer/messageRenderer";
import { PlaylistRenderer } from "../../renderer/playlistRenderer";
import { RecognitionShelfRenderer } from "../../renderer/recognitionShelfRenderer";
import { ReelShelfRenderer } from "../../renderer/reelShelfRenderer";
import { SectionListRenderer } from "../../renderer/sectionListRenderer";
import { VideoRenderer } from "../../renderer/videoRenderer";
import { LockupViewModel } from "../../generic/models/lockupViewModel";

export type Home = {
  title: 'Home',
  endpoint: NavigationEndpoint
  content?: {
    sectionListRenderer: SectionListRenderer<{
      content: {
        channelOwnerEmptyStateRenderer?: ChannelOwnerEmptyStateRenderer
        itemSectionRenderer?: ItemSectionRenderer<{
          /**
           * defined when channel doesn't have any featured content
           */
          messageRenderer?: MessageRenderer
          recognitionShelfRenderer?: RecognitionShelfRenderer
          channelVideoPlayerRenderer?: ChannelVideoPlayerRenderer
          channelFeaturedContentRenderer?: ChannelFeaturedContentRenderer
          reelShelfRenderer?: ReelShelfRenderer
          shelfRenderer?: {
            title: Text
            endpoint: NavigationEndpoint
            content: {
              expandedShelfContentsRenderer?: ExpandedShelfContentsRenderer<{
                channelRenderer?: ChannelRenderer
                videoRenderer?: VideoRenderer
                playlistRenderer?: PlaylistRenderer
              }>
              horizontalListRenderer?: {
                items: {
                  gridVideoRenderer?: GridVideoRenderer
                  gridChannelRenderer?: GridChannelRenderer
                  gridPlaylistRenderer?: GridPlaylistRenderer
                  lockupViewModel?: LockupViewModel
                  postRenderer?: {}
                }[]
              }
            }
          }
        }>
      }
    }>
  }
};

export function getFeaturedDisplay(data: Home): (
  | ['membersRecognition']
  | ['communityPosts']
  | ['live', string[]]
  | ['featured', string]
  | ['playlist', string]
  | ['playlists', string]
  | ['channels', string]
  | ['videos', 'Upcoming live streams' | 'Live now']
)[] {
  if (
    data.content!.sectionListRenderer.contents[0]
      .channelOwnerEmptyStateRenderer
    || data.content!.sectionListRenderer.contents[0]
      .itemSectionRenderer?.contents[0].messageRenderer
  ) return [];
  return data.content!.sectionListRenderer.contents.map(content => {
    const item = content.itemSectionRenderer!.contents[0];
    if (item.channelFeaturedContentRenderer)
      return [
        'live',
        channelFeaturedContentRenderer.getVideoIds(item.channelFeaturedContentRenderer),
      ];
    if (item.channelVideoPlayerRenderer)
      return [
        'featured',
        channelVideoPlayerRenderer.getVideoId(item.channelVideoPlayerRenderer),
      ];
    if ('recognitionShelfRenderer' in item)
      return ['membersRecognition'];
    if (item.shelfRenderer?.endpoint.commandMetadata?.webCommandMetadata
      .url?.includes('/playlist?')
    ) return [
      'playlist',
      item.shelfRenderer.endpoint.browseEndpoint!.browseId
        .replace(/^VL/, '') // View List??
    ];
    if (
      item.shelfRenderer?.content.horizontalListRenderer?.items[0].gridPlaylistRenderer
      || item.shelfRenderer?.content.expandedShelfContentsRenderer?.items[0].playlistRenderer
      || item.shelfRenderer?.content.horizontalListRenderer?.items[0].lockupViewModel?.contentId.startsWith('PL')
    )
      return [
        'playlists',
        getOriginalText(item.shelfRenderer.title),
      ];
    if (
      item.shelfRenderer?.content.horizontalListRenderer?.items[0].gridChannelRenderer
      || item.shelfRenderer?.content.expandedShelfContentsRenderer?.items[0].channelRenderer
    )
      return [
        'channels',
        getOriginalText(item.shelfRenderer.endpoint.showEngagementPanelEndpoint!
          .engagementPanel.engagementPanelSectionListRenderer.header
          .engagementPanelTitleHeaderRenderer.title),
      ];
    const channelId = data.endpoint.browseEndpoint!.browseId;
    if (item.shelfRenderer?.endpoint.commandMetadata?.webCommandMetadata
      .url?.includes('/videos?')
    ) {
      const url = item.shelfRenderer.endpoint.commandMetadata.webCommandMetadata.url;
      // shelf_id can be ignored since it's the index of the item in the featured tab
      if (/\/videos\?view=0&sort=dd&shelf_id=\d+$/.test(url)) // Videos
        return ['playlist', channelId.replace('UC', 'UULF')];
      if (/\/videos\?view=0&sort=p&shelf_id=\d+$/.test(url)) // Popular videos
        return ['playlist', channelId.replace('UC', 'UULP')];
      if (/\/videos\?view=2&sort=dd&live_view=503&shelf_id=\d+$/.test(url)) // Past live streams
        return ['playlist', channelId.replace('UC', 'UULV')];
      if (/\/videos\?view=2&sort=dd&live_view=501&shelf_id=\d+$/.test(url)) // Live now
        return ['videos', 'Live now'];
      if (/\/videos\?view=2&sort=dd&live_view=502&shelf_id=\d+$/.test(url)) // Upcoming live streams
        return ['videos', 'Upcoming live streams'];
      // if (/\/videos\?view=2&sort=dd&live_view=502&shelf_id=\d+$/.test(url)) // Upcoming live streams
      //   return ['playlists', 'Created playlists'];
      throw new Error(`Unknown videos: ${url} (${getOriginalText(item.shelfRenderer.title)})`);
    }
    if (item.reelShelfRenderer)
      return ['playlist', channelId.replace('UC', 'UUSH')];
    if (item.shelfRenderer?.content.horizontalListRenderer?.items[0].postRenderer)
      return ['communityPosts'];
    throw new Error(`Unknown featured display: ${Object.keys(item)[0]}`);
  });
}

export async function getAllRelatedChannel(innertubeApiKey: string, data: Home, channelId: string) {
  const output: [string, string[]][] = [];
  // not possible to get subs now
  // featured
  for (const content of data.content!.sectionListRenderer.contents) {
    const item = content.itemSectionRenderer?.contents[0]
      .shelfRenderer;
    if (
      !item?.content.expandedShelfContentsRenderer?.items[0].channelRenderer
      && !item?.content.horizontalListRenderer?.items[0].gridChannelRenderer
    ) continue;
    const initialItems = item.endpoint.showEngagementPanelEndpoint!
      .engagementPanel.engagementPanelSectionListRenderer
      .content.sectionListRenderer.contents[0].itemSectionRenderer.contents;
    const channelIds: string[] = [];
    for await (const { gridRenderer } of browseAll(innertubeApiKey, initialItems)) {
      const initialItems = gridRenderer!.items;
      for await (const { gridChannelRenderer } of browseAll(innertubeApiKey, initialItems))
        channelIds.push(gridChannelRenderer!.channelId);
    }
    output.push([
      getOriginalText(item.endpoint.showEngagementPanelEndpoint!
        .engagementPanel.engagementPanelSectionListRenderer
        .header.engagementPanelTitleHeaderRenderer.title),
      channelIds,
    ]);
  }

  return output;
}

export async function getAllRelatedPlaylists(innertubeApiKey: string, data: Home, channelId: string) {
  const output: [string, string[]][] = [];
  // playlists
  const initialItems = await browseChannelPlaylists(channelId)
    .then(res => getChannelTab(res, 'Playlists')
      ?.tabRenderer.content!.sectionListRenderer.contents[0]
      .itemSectionRenderer.contents[0].gridRenderer?.items);
  if (initialItems) {
    const playlistIds = [];
    for await (const { gridPlaylistRenderer, gridShowRenderer, lockupViewModel } of browseAll(innertubeApiKey, initialItems)) {
      const playlistId = gridPlaylistRenderer?.playlistId
        ?? gridShowRenderer?.navigationEndpoint.browseEndpoint?.browseId.replace(/^VL/, '')
        ?? lockupViewModel?.contentId;
      if (!playlistId)
        throw new Error(`Unable to get playlistId`);
      playlistIds.push(playlistId);
    }
    output.push(['Created playlists', playlistIds]);
  }
  // featured
  for (const content of data.content!.sectionListRenderer.contents) {
    const item = content.itemSectionRenderer?.contents[0]
      .shelfRenderer;
    if (
      !item?.content.expandedShelfContentsRenderer?.items[0].playlistRenderer
      && !item?.content.horizontalListRenderer?.items[0].gridPlaylistRenderer
    ) continue;
    // skip `Created playlists` in featured
    if (!item.endpoint.showEngagementPanelEndpoint)
      continue;
    const initialItems = item.endpoint.showEngagementPanelEndpoint
      .engagementPanel.engagementPanelSectionListRenderer
      .content.sectionListRenderer.contents[0].itemSectionRenderer.contents;
    const playlistIds: string[] = [];
    for await (const { gridRenderer } of browseAll(innertubeApiKey, initialItems)) {
      const initialItems = gridRenderer!.items;
      for await (const { gridPlaylistRenderer, gridShowRenderer } of browseAll(innertubeApiKey, initialItems)) {
        const playlistId = gridPlaylistRenderer?.playlistId
          ?? gridShowRenderer?.navigationEndpoint.browseEndpoint?.browseId.replace(/^VL/, '');
        if (!playlistId)
          throw new Error(`Unable to get playlistId`);
        playlistIds.push(playlistId);
      }
    }
    output.push([
      // TODO: test for Multiple playlists where the popup one doesn't have title
      getOriginalText(content.itemSectionRenderer!.contents[0].shelfRenderer!.title),
      playlistIds,
    ]);
  }

  return output;
}
