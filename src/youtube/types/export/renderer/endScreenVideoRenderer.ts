import { Runs } from "../generic/runs";
import { Text } from "../generic/text";

export type EndScreenVideoRenderer = {
  "videoId": string,
  /**
   * `食える飯が作りたい。~第2話~【はあちゃまクッキング・改】`
   */
  title: Text
  "shortBylineText": {
    "runs": [
      {
        /**
         * `HAACHAMA Ch 赤井はあと`
         */
        "text": string,
        "navigationEndpoint": {
          "browseEndpoint": {
            /**
             * `UC1CfXB_kRs3C-zaeTG3oGyg`
             */
            "browseId": string,
            /**
             * `/@AkaiHaato`
             */
            "canonicalBaseUrl": string
          }
        }
      }
    ]
  },
  "lengthInSeconds"?: number,
  /**
   * `128K views`
   */
  shortViewCountText: Text
  /**
   * `6 months ago`
   */
  publishedTimeText: Text
};
