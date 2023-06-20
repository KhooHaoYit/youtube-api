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
  lengthText: {
    /**
     * `7:09`
     */
    simpleText: string
  },
  channelThumbnail: {
    thumbnails: [{
      /**
       * `https://yt3.ggpht.com/B2tq3IQAFxUe9W3MaMc0V62bmlTWCSoTuCk-Y-Ab8yXkZKdIswQhHABZhz2e4YM1-B_Kxen_7w=s68-c-k-c0x00ffffff-no-rj`
       */
      url: string,
    }]
  },
  /**
   * Not accurate
   * `6 months ago`
   */
  publishedTimeText: {},
};
