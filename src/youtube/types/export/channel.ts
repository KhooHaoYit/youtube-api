import { C4TabbedHeaderRenderer } from './renderer/c4TabbedHeaderRenderer';
import { GridChannelRenderer } from './renderer/gridChannelRenderer';
import { ContinuationItemRenderer } from './renderer/continuationItemRenderer';
import { GridPlaylistRenderer } from './renderer/gridPlaylistRenderer';
import { ChannelAboutFullMetadataRenderer } from './renderer/channelAboutFullMetadataRenderer';
import { ChannelFeaturedContentRenderer } from './renderer/channelFeaturedContentRenderer';
import { RecognitionShelfRenderer } from './renderer/recognitionShelfRenderer';
import { ChannelVideoPlayerRenderer } from './renderer/channelVideoPlayerRenderer';
import { ReelShelfRenderer } from './renderer/reelShelfRenderer';
import { ItemSectionRenderer } from './renderer/itemSectionRenderer';
import { BackstagePostThreadRenderer } from './renderer/backstagePostThreadRenderer';
import { SectionListRenderer, getContents, getSubMenu } from './renderer/sectionListRenderer';
import { GridRenderer } from './renderer/gridRenderer';
import { VideoSecondaryInfoRenderer } from './renderer/videoSecondaryInfoRenderer';
import { VideoPrimaryInfoRenderer } from './renderer/videoPrimaryInfoRenderer';
import { VideoRenderer } from './renderer/videoRenderer';
import { SponsorshipsExpandablePerksRenderer } from './renderer/sponsorshipsExpandablePerksRenderer';
import { SponsorshipsAlertRenderer } from './renderer/sponsorshipsAlertRenderer';
import { RichGridRenderer } from './renderer/richGridRenderer';
import { RichItemRenderer } from './renderer/richItemRenderer';
import { PlaylistRenderer } from './renderer/playlistRenderer';
import { ReelItemRenderer } from './renderer/reelItemRenderer';
import { Runs } from './generic/runs';
import { ChannelSubMenuRenderer, getSubMenuItemsInfo } from './renderer/channelSubMenuRenderer';

export type TabChannels = {
  title: 'Channels',
  /**
   * not defined if request isn't requesting /channel/CHANNEL_ID/channels
   */
  content?: {
    sectionListRenderer: SectionListRenderer<{
      content: {
        itemSectionRenderer: ItemSectionRenderer<{
          gridRenderer?: GridRenderer<{
            gridChannelRenderer?: GridChannelRenderer,
            continuationItemRenderer?: ContinuationItemRenderer
          }>,
          /**
           * defined when showing multiple channel categories
           */
          shelfRenderer?: {
            // "content"?: {},
          },
          /**
           * defined when channel doesn't have any subs
           */
          messageRenderer?: {
            text: { simpleText: "This channel doesn't feature any other channels." },
          },
        }>,
      }[],
      /**
       * not defined when channel doesn't have any subs
       */
      subMenu: { channelSubMenuRenderer: ChannelSubMenuRenderer },
    }>
  },
};

export type TabPlaylists = {
  title: 'Playlists',
  /**
   * not defined if request aren't from /channel/CHANNEL_ID/playlists
   */
  content?: {
    sectionListRenderer: SectionListRenderer<{
      content: {
        itemSectionRenderer: ItemSectionRenderer<{
          gridRenderer?: GridRenderer<{
            gridPlaylistRenderer: GridPlaylistRenderer
          }>,
          /**
           * defined when showing multiple playlists categories
           */
          shelfRenderer?: {},
          /**
           * defined when channel doesn't have any playlists
           */
          messageRenderer?: {}
        }>,
      },
      /**
       * not defined when channel doesn't have any playlists
       */
      subMenu: { channelSubMenuRenderer: ChannelSubMenuRenderer },
    }>,
  },
};

export function getPlaylists(tab: TabPlaylists) {
  const list = getContents(tab.content!.sectionListRenderer)[0]
    .itemSectionRenderer.contents;
  if (list[0].messageRenderer)
    return {
      playlists: [],
      subMenu: [],
    };
  const subMenu = getSubMenu(tab.content!.sectionListRenderer);
  return {
    playlists: list[0].gridRenderer
      ? list[0].gridRenderer.items
      : [],
    subMenu: subMenu?.channelSubMenuRenderer
      ? getSubMenuItemsInfo(subMenu.channelSubMenuRenderer)
      : [],
  };
}

export type TabAbout = {
  title: 'About',
  "content"?: {
    sectionListRenderer: SectionListRenderer<{
      content: {
        itemSectionRenderer: ItemSectionRenderer<{
          channelAboutFullMetadataRenderer: ChannelAboutFullMetadataRenderer
        }>,
      }
    }>
  }
};

export type TabHome = {
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
  "content"?: {
    sectionListRenderer: SectionListRenderer<{
      content: {
        itemSectionRenderer: ItemSectionRenderer<{
          /**
           * defined when channel doesn't have any featured content
           */
          messageRenderer?: {}
          recognitionShelfRenderer?: RecognitionShelfRenderer
          channelVideoPlayerRenderer?: ChannelVideoPlayerRenderer
          channelFeaturedContentRenderer?: ChannelFeaturedContentRenderer
          reelShelfRenderer?: ReelShelfRenderer,
          shelfRenderer?: {
            "title": {
              runs: Runs
            },
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

export type TabCommunity = {
  title: 'Community',
  "content"?: {
    sectionListRenderer: SectionListRenderer<{
      content: {
        itemSectionRenderer: ItemSectionRenderer<{
          messageRenderer?: {}
          backstagePostThreadRenderer?: BackstagePostThreadRenderer,
          continuationItemRenderer?: ContinuationItemRenderer,
        }>
      }
    }>,
  },
};

export function getCommunityPosts(tab: TabCommunity) {
  const posts = tab.content!.sectionListRenderer.contents[0]
    .itemSectionRenderer.contents;
  if ('messageRenderer' in posts[0])
    return [];
  return posts as Exclude<typeof posts[0], { messageRenderer: any }>[];
}

export type TabMembership = {
  title: 'Membership',
  "content"?: {
    sectionListRenderer: SectionListRenderer<{
      content: {
        sponsorshipsExpandablePerksRenderer?: SponsorshipsExpandablePerksRenderer
        itemSectionRenderer?: ItemSectionRenderer<{
          sponsorshipsAlertRenderer?: SponsorshipsAlertRenderer
          backstagePostThreadRenderer?: BackstagePostThreadRenderer
          videoRenderer?: VideoRenderer
          continuationItemRenderer?: ContinuationItemRenderer
        }>
      }
    }>,
  },
}

export type TabReleases = {
  title: 'Releases'
  content?: {
    richGridRenderer: RichGridRenderer<{
      richItemRenderer: RichItemRenderer<{
        playlistRenderer: PlaylistRenderer
      }>
    }>
  }
}

export type TabVideos = {
  title: 'Videos'
  content?: {
    richGridRenderer: RichGridRenderer<{
      richItemRenderer?: RichItemRenderer<{
        videoRenderer?: VideoRenderer
      }>
      continuationItemRenderer?: ContinuationItemRenderer
    }>
  }
}

export type TabLive = {
  title: 'Live',
  content?: {
    richGridRenderer: RichGridRenderer<{
      richItemRenderer?: RichItemRenderer<{
        videoRenderer: VideoRenderer,
      }>
      continuationItemRenderer?: ContinuationItemRenderer,
    }>
  }
}

export type TabShorts = {
  title: 'Shorts',
  content?: {
    richGridRenderer: RichGridRenderer<{
      richItemRenderer?: RichItemRenderer<{
        reelItemRenderer: ReelItemRenderer
      }>
      continuationItemRenderer?: ContinuationItemRenderer
    }>
  }
}

export type TabPodcasts = {
  title: 'Podcasts'
  content?: {
    richGridRenderer: RichGridRenderer<{
      richItemRenderer: RichItemRenderer<{
        playlistRenderer: PlaylistRenderer
      }>
    }>
  }
}

export type TabSearch = {
  title: 'Search'
}

export type Channel = {
  /**
   * defined only when requesting /channel/CHANNEL_ID
   */
  header?: { c4TabbedHeaderRenderer: C4TabbedHeaderRenderer },
  /**
   * not defined when channel doesn't exists
   */
  contents?: {
    twoColumnBrowseResultsRenderer: {
      tabs: {
        tabRenderer?: TabHome
        | TabChannels
        | TabPlaylists
        | TabAbout
        | TabCommunity
        | TabMembership
        | TabReleases
        | TabVideos
        | TabLive
        | TabShorts
        | TabPodcasts,
        expandableTabRenderer?: TabSearch
      }[],
    },
  } | {
    twoColumnWatchNextResults: {
      results: {
        results: {
          contents: {
            videoPrimaryInfoRenderer?: VideoPrimaryInfoRenderer,
            videoSecondaryInfoRenderer?: VideoSecondaryInfoRenderer,
            itemSectionRenderer?: {},
          }[]
        }
      }
    }
  },
};
