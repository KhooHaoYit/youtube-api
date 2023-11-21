import { browseAll, browseChannelSubs } from "../../endpoints/browse";
import { NavigationEndpoint } from "../../generic/navigationEndpoint";
import { Text, getOriginalText } from "../../generic/text";
import { ChannelFeaturedContentRenderer } from "../../renderer/channelFeaturedContentRenderer";
import * as channelFeaturedContentRenderer from "../../renderer/channelFeaturedContentRenderer";
import { ChannelOwnerEmptyStateRenderer } from "../../renderer/channelOwnerEmptyStateRenderer";
import { ChannelVideoPlayerRenderer } from "../../renderer/channelVideoPlayerRenderer";
import * as channelVideoPlayerRenderer from "../../renderer/channelVideoPlayerRenderer";
import { ExpandedShelfContentsRenderer } from "../../renderer/expandedShelfContentsRenderer";
import { GridChannelRenderer } from "../../renderer/gridChannelRenderer";
import { GridPlaylistRenderer } from "../../renderer/gridPlaylistRenderer";
import { GridVideoRenderer } from "../../renderer/gridVideoRenderer";
import { ItemSectionRenderer } from "../../renderer/itemSectionRenderer";
import { MessageRenderer } from "../../renderer/messageRenderer";
import { RecognitionShelfRenderer } from "../../renderer/recognitionShelfRenderer";
import { ReelShelfRenderer } from "../../renderer/reelShelfRenderer";
import { SectionListRenderer } from "../../renderer/sectionListRenderer";

export type Home = {
  title: 'Home',
  // "endpoint": {
  //   "browseEndpoint": {
  //     /**
  //      * `UCAPdxmEjYxUdQMf_JaQRl1Q`
  //      */
  //     "browseId": string,
  //     /**
  //      * `/@manae_nme`
  //      */
  //     "canonicalBaseUrl": string
  //   }
  // },
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
              expandedShelfContentsRenderer?: ExpandedShelfContentsRenderer
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
  | ['shorts']
  | ['live', string[]]
  | ['featured', string]
  | ['playlist', string]
  | ['playlists', string]
  | ['channels', string]
  | ['videos', string]
)[] {
  if (
    data.content!.sectionListRenderer.contents[0]
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
      .url.includes('/playlist?')
    ) return [
      'playlist',
      item.shelfRenderer.endpoint.browseEndpoint!.browseId
        .replace(/^VL/, '') // View List??
    ];
    if (item.shelfRenderer?.content.horizontalListRenderer?.items[0].gridPlaylistRenderer)
      return [
        'playlists',
        getOriginalText(item.shelfRenderer.title),
      ];
    if (item.shelfRenderer?.content.horizontalListRenderer?.items[0].gridChannelRenderer)
      return [
        'channels',
        getOriginalText(item.shelfRenderer.endpoint.showEngagementPanelEndpoint!
          .engagementPanel.engagementPanelSectionListRenderer.header
          .engagementPanelTitleHeaderRenderer.title),
      ];
    if (item.shelfRenderer?.endpoint.commandMetadata?.webCommandMetadata
      .url.includes('/videos?')
    ) return [
      'videos',
      getOriginalText(item.shelfRenderer.title),
    ];
    if (item.reelShelfRenderer)
      return ['shorts'];
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
    if (!item?.content.horizontalListRenderer?.items[0].gridChannelRenderer)
      continue;
    const initialItems = item.endpoint.showEngagementPanelEndpoint!
      .engagementPanel.engagementPanelSectionListRenderer
      .content.sectionListRenderer.contents[0].itemSectionRenderer.contents;
    const channelIds: string[] = [];
    for await (const { gridRenderer } of browseAll(innertubeApiKey, initialItems)) {
      const initialItems = gridRenderer.items;
      for await (const { gridChannelRenderer } of browseAll(innertubeApiKey, initialItems))
        channelIds.push(gridChannelRenderer.channelId);
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
