import { Text, getOriginalText } from "../../generic/text";
import { ChannelFeaturedContentRenderer } from "../../renderer/channelFeaturedContentRenderer";
import * as channelFeaturedContentRenderer from "../../renderer/channelFeaturedContentRenderer";
import { ChannelVideoPlayerRenderer } from "../../renderer/channelVideoPlayerRenderer";
import * as channelVideoPlayerRenderer from "../../renderer/channelVideoPlayerRenderer";
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
        itemSectionRenderer: ItemSectionRenderer<{
          /**
           * defined when channel doesn't have any featured content
           */
          messageRenderer?: MessageRenderer
          recognitionShelfRenderer?: RecognitionShelfRenderer
          channelVideoPlayerRenderer?: ChannelVideoPlayerRenderer
          channelFeaturedContentRenderer?: ChannelFeaturedContentRenderer
          reelShelfRenderer?: ReelShelfRenderer,
          shelfRenderer?: {
            title: Text
            "endpoint": {
              "commandMetadata": {
                "webCommandMetadata": {
                  /**
                   * `/playlist?list=PLiniJMqFuOJ5Abuuomzy10K4UyZKw-6l0`
                   * `/@AlettaSky/playlists?view=50&sort=dd&shelf_id=6`
                   */
                  "url": string,
                },
              },
              "browseEndpoint": {
                /**
                 * `VLPLYKsjO4OGbhgTGv8M1s06Kempg9Dj-Iay`
                 */
                "browseId": string,
              }
            },
            "content": {
              // "horizontalListRenderer": {
              //   "items": (
              //     {
              //       gridVideoRenderer: {
              //         "videoId": string,
              //         "title": {
              //           /**
              //            * `最愛 - KOH⁺(Cover)／まなえ`
              //            */
              //           "simpleText": string
              //         },
              //         "publishedTimeText": {
              //           /**
              //            * `3 months ago`
              //            */
              //           "simpleText": string
              //         },
              //         /**
              //          * not defined when it's membership video
              //          */
              //         "viewCountText"?: {
              //           /**
              //            * `1,513 views`
              //            */
              //           "simpleText": string,
              //         },
              //         "shortBylineText": {
              //           "runs": [{
              //             /**
              //              * `manae ch. / まなえ`
              //              */
              //             "text": string,
              //             "navigationEndpoint": {
              //               "browseEndpoint": {
              //                 /**
              //                  * `UCAPdxmEjYxUdQMf_JaQRl1Q`
              //                  */
              //                 "browseId": string,
              //                 /**
              //                  * `/@manae_nme`
              //                  */
              //                 "canonicalBaseUrl": string
              //               }
              //             }
              //           }]
              //         },
              //         /**
              //          * contains info that video can be view offline or not
              //          */
              //         "offlineability": {},
              //         "thumbnailOverlays": (
              //           {
              //             "thumbnailOverlayTimeStatusRenderer": {
              //               "text": {
              //                 /**
              //                  * `5:34`
              //                  */
              //                 "simpleText": string
              //               },
              //             }
              //           } | {
              //             thumbnailOverlayToggleButtonRenderer: {},
              //           } | {
              //             thumbnailOverlayNowPlayingRenderer: {},
              //           }
              //         )[]
              //       }
              //     } | {
              //       gridPlaylistRenderer: {}
              //     }
              //   )[],
              // },
            },
          },
        }>,
      }
    }>,
  },
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
      .itemSectionRenderer.contents[0].messageRenderer
  ) return [];
  return data.content!.sectionListRenderer.contents.map(content => {
    const item = content.itemSectionRenderer.contents[0];
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
    if (item.shelfRenderer?.endpoint.commandMetadata.webCommandMetadata
      .url.includes('/playlist?')
    ) return [
      'playlist',
      item.shelfRenderer.endpoint.browseEndpoint.browseId
        .replace(/^VL/, '') // View List??
    ];
    if (item.shelfRenderer?.endpoint.commandMetadata.webCommandMetadata
      .url.includes('/playlists?')
    ) return [
      'playlists',
      getOriginalText(item.shelfRenderer.title),
    ];
    if (item.shelfRenderer?.endpoint.commandMetadata.webCommandMetadata
      .url.includes('/channels?')
    ) return [
      'channels',
      getOriginalText(item.shelfRenderer.title),
    ];
    if (item.shelfRenderer?.endpoint.commandMetadata.webCommandMetadata
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
