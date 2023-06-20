import { SubscriberCountText } from "../generic/subscriberCountText";

export type VideoSecondaryInfoRenderer = {
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
      subscriberCountText: SubscriberCountText,
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
};


