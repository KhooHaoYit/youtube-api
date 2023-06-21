import { Image } from "../generic/image";
import { ViewCountText } from "../generic/viewCountText";

export type CompactVideoRenderer = {
  videoId: string,
  title: {
    /**
     * `食える飯が作りたい。~第2話~【はあちゃまクッキング・改】`
     */
    simpleText: string,
  },
  longBylineText: {
    runs: [
      {
        /**
         * `HAACHAMA Ch 赤井はあと`
         */
        text: string,
        navigationEndpoint: {
          browseEndpoint: {
            /**
             * `UC1CfXB_kRs3C-zaeTG3oGyg`
             */
            browseId: string,
            /**
             * `/@AkaiHaato`
             */
            canonicalBaseUrl: string
          }
        }
      }
    ]
  },
  viewCountText: ViewCountText,
  /**
   * not defined when streaming
   * 
   * `7:09`
   */
  lengthText?: {
    simpleText: string
  },
  channelThumbnail: Image,
  /**
   * Not accurate
   * 
   * not defined when streaming
   * 
   * `6 months ago`
   */
  publishedTimeText?: {},
};
