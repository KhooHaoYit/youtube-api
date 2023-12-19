import { browseAll, browseChannelSubs } from "../../endpoints/browse";
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
      if (url.endsWith('/videos?view=0&sort=dd&shelf_id=0')) // Videos
        return ['playlist', channelId.replace('UC', 'UULF')];
      if (url.endsWith('/videos?view=0&sort=p&shelf_id=0')) // Popular videos
        return ['playlist', channelId.replace('UC', 'UULP')];
      if (url.endsWith('/videos?view=2&sort=dd&live_view=503&shelf_id=0')) // Past live streams
        return ['playlist', channelId.replace('UC', 'UULV')];
      if (url.endsWith('/videos?view=2&sort=dd&live_view=501&shelf_id=0')) // Live now
        return ['videos', 'Live now'];
      if (url.endsWith('/videos?view=2&sort=dd&live_view=502&shelf_id=0')) // Upcoming live streams
        return ['videos', 'Upcoming live streams'];
      throw new Error(`Unknown videos: ${url} (${getOriginalText(item.shelfRenderer.title)})`);
    }
    if (item.reelShelfRenderer)
      return ['playlist', channelId.replace('UC', 'UUSH')];
    throw new Error(`Unknown featured display`);
  });
}

export async function getAllRelatedChannel(innertubeApiKey: string, data: Home, channelId: string) {
  const output: [string, string[]][] = [['Subscriptions', []]];
  // subs
  const initialItems = await browseChannelSubs(channelId)
    .then(res => res.onResponseReceivedEndpoints[0]
      .appendContinuationItemsAction.continuationItems[0]
      .gridRenderer.items);
  for await (const { gridChannelRenderer } of browseAll(innertubeApiKey, initialItems))
    output[0][1].push(gridChannelRenderer!.channelId);
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
