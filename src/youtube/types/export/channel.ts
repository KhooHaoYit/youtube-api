import { C4TabbedHeaderRenderer } from './c4TabbedHeaderRenderer';
import { GridChannelRenderer } from './gridChannelRenderer';
import { ContinuationItemRenderer } from './continuationItemRenderer';
import { GridPlaylistRenderer } from './gridPlaylistRenderer';
import { ChannelAboutFullMetadataRenderer } from './channelAboutFullMetadataRenderer';

export type TabChannels = {
  title: 'Channels',
  /**
   * not defined if request isn't requesting /channel/CHANNEL_ID/channels
   */
  content?: {
    sectionListRenderer: {
      contents: {
        itemSectionRenderer: {
          contents: {
            gridRenderer?: {
              items: (
                { gridChannelRenderer: GridChannelRenderer }
                | { continuationItemRenderer: ContinuationItemRenderer }
              )[],
            },
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
          }[],
        },
      }[],
      /**
       * not defined when channel doesn't have any subs
       */
      subMenu?: {
        channelSubMenuRenderer: {
          contentTypeSubMenuItems: {
            endpoint: {
              browseEndpoint: {
                browseId: string,
                params: string,
              },
            },
            title: string,
            selected: boolean,
          }[],
        },
      },
    },
  },
};

export type TabPlaylists = {
  title: 'Playlists',
  /**
   * not defined if request aren't from /channel/CHANNEL_ID/playlists
   */
  content?: {
    sectionListRenderer: {
      contents: {
        itemSectionRenderer: {
          contents: {
            gridRenderer?: {
              items: { gridPlaylistRenderer: GridPlaylistRenderer }[],
            },
            /**
             * defined when showing multiple channel categories
             */
            shelfRenderer?: {},
          }[],
        },
      }[],
      subMenu: {
        channelSubMenuRenderer: {
          contentTypeSubMenuItems: {
            endpoint: {
              browseEndpoint: {
                browseId: string,
                params: string,
              }
            },
            title: string,
          }[],
        },
      },
    },
  },
};

export type TabAbout = {
  title: 'About',
  "content"?: {
    "sectionListRenderer": {
      "contents": {
        "itemSectionRenderer": {
          "contents": { "channelAboutFullMetadataRenderer": ChannelAboutFullMetadataRenderer }[],
        }
      }[]
    }
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
    "sectionListRenderer": {
      "contents": (
        {
          "itemSectionRenderer": {
            "contents": {
              recognitionShelfRenderer: {},
            }[],
          },
        } | {
          "itemSectionRenderer": {
            "contents": {
              channelVideoPlayerRenderer: {
                "videoId": string,
                "title": {
                  "runs": [{
                    /**
                     * `僕が死のうと思ったのは - 中島美嘉(Cover)／まなえ`
                     */
                    "text": string,
                  }],
                },
                "description": {
                  /**
                   * original description can be reconstructed by joining all text
                   */
                  runs: { text: string }[],
                },
                "viewCountText": {
                  /**
                   * `1,952 views`
                   */
                  "simpleText": string
                },
                "publishedTimeText": {
                  "runs": [{
                    /**
                     * `5 months ago`
                     */
                    "text": string
                  }]
                },
              }
            }[],
          }
        } | {
          "itemSectionRenderer": {
            "contents": {
              channelFeaturedContentRenderer: {
                items: {
                  "videoRenderer": {
                    "videoId": string,
                    "title": {
                      "runs": [{
                        /**
                         * `【 卒業 】見つけてくれてありがとう【 #なまえはまなえ 】`
                         */
                        "text": string
                      }],
                      /**
                       * contains information on total views
                       */
                      "accessibility": {}
                    },
                    /**
                     * contains partial description
                     */
                    "descriptionSnippet": {},
                    "longBylineText": {
                      "runs": [{
                        /**
                         * `manae ch. / まなえ`
                         */
                        "text": string,
                      }],
                    },
                    /**
                     * contains the amount of people watching
                     */
                    "viewCountText": {},
                    "channelThumbnailSupportedRenderers": {
                      "channelThumbnailWithLinkRenderer": {
                        "thumbnail": {
                          "thumbnails": [{
                            /**
                             * `https://yt3.googleusercontent.com/3mZlwlZuutYj6T4cNi1R541tebUtPXhgwz0bvLer-k_8c81qe2wdrQe6cx4JuosWntmvY3R1=s68-c-k-c0x00ffffff-no-rj`
                             */
                            "url": string,
                          }]
                        },
                        "navigationEndpoint": {
                          "browseEndpoint": {
                            /**
                             * `UCAPdxmEjYxUdQMf_JaQRl1Q`
                             */
                            "browseId": string,
                            /**
                             * `/@manae_nme`
                             */
                            "canonicalBaseUrl": string
                          }
                        },
                      }
                    },
                  }
                }[],
              }
            }[],
          }
        } | {
          "itemSectionRenderer": {
            "contents": {
              shelfRenderer: {
                "title": {
                  "runs": [{
                    /**
                     * `カバー / COVER`
                     */
                    "text": string,
                  }]
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
            }[],
          }
        } | {
          "itemSectionRenderer": {
            "contents": {
              reelShelfRenderer: {
                "items": {
                  "reelItemRenderer": {
                    "videoId": string,
                    "headline": {
                      /**
                       * `【 子供の夢✨  】お菓子の山を作ってみたら大変なことになった...！？(完結編)【 #shorts 】`
                       */
                      "simpleText": string
                    },
                    "viewCountText": {
                      /**
                       * `313 views`
                       */
                      "simpleText": string
                    },
                  },
                }[],
              },
            }[],
          },
        }
      )[],
    },
  },
};

export type Channel = {
  /**
   * defined only when requesting /channel/CHANNEL_ID
   */
  header?: { c4TabbedHeaderRenderer: C4TabbedHeaderRenderer },
  contents: {
    twoColumnBrowseResultsRenderer: {
      tabs: (
        {
          tabRenderer: {
            title: 'Videos'
            | 'Shorts'
            | 'Live'
            | 'Podcasts'
            | 'Releases'
            | 'Community'
          } | TabHome
          | TabChannels
          | TabPlaylists
          | TabAbout,
        } | {
          /**
           * search within channel
           */
          expandableTabRenderer: {}
        }
      )[],
    },
  } | {
    twoColumnWatchNextResults: {
      "results": {
        "results": {
          "contents": (
            {
              videoPrimaryInfoRenderer: {
                title: {
                  runs: [{
                    /**
                     * Delicious Yummy Tasty GYOZA!!!
                     */
                    text: string
                  }],
                },
                viewCount: {
                  videoViewCountRenderer: {
                    viewCount: {
                      /**
                       * `61,712 views`
                       */
                      simpleText: string
                    },
                  }
                },
                videoActions: {
                  menuRenderer: {
                    topLevelButtons: (
                      {
                        segmentedLikeDislikeButtonRenderer: {
                          likeButton: {
                            toggleButtonRenderer: {
                              defaultText: {
                                accessibility: {
                                  accessibilityData: {
                                    /**
                                     * `5,139 likes`
                                     */
                                    label: string
                                  }
                                },
                              },
                            }
                          }
                        }
                      }
                      | { buttonRenderer: {} }
                    )[],
                  }
                },
                dateText: {
                  /**
                   * Dec 15, 2022
                   */
                  simpleText: string
                },
              },
            } | {
              videoSecondaryInfoRenderer: {
                owner: {
                  videoOwnerRenderer: {
                    thumbnail: {
                      thumbnails: { url: string }[],
                    },
                    title: {
                      runs: [
                        {
                          /**
                           * `HAACHAMA Ch 赤井はあと`
                           */
                          text: string,
                        }
                      ]
                    },
                    navigationEndpoint: {
                      browseEndpoint: {
                        /**
                         * `UC1CfXB_kRs3C-zaeTG3oGyg`
                         */
                        browseId: string,
                        /**
                         * /@AkaiHaato
                         */
                        canonicalBaseUrl: string,
                      }
                    },
                    subscriberCountText: {
                      /**
                       * `1.42M subscribers`
                       */
                      simpleText: string
                    },
                    membershipButton: {}
                  }
                },
                attributedDescription: {
                  /**
                   * description (need to find ways to fix link back - KpCH4mbj_pk twitter link cut off)
                   */
                  content: string,
                  commandRuns: {
                    startIndex: number,
                    length: number,
                    onTap: {
                      innertubeCommand: {
                        commandMetadata: {
                          webCommandMetadata: {
                            /**
                             * `/playlist?list=PLQoA24ikdy_n3hEVbX5PkDrZVV7XAbbrz`
                             * `https://www.youtube.com/redirect?...`
                             */
                            url: string,
                          }
                        },
                      }
                    }
                  }[],
                }
              },
            } | {
              itemSectionRenderer: {},
            }
          )[]
        }
      }
    }
  },
};
