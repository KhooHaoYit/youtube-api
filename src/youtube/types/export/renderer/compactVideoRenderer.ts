import { Image } from "../generic/image";
import { NavigationEndpoint } from "../generic/navigationEndpoint";
import { Text } from "../generic/text";
import { ViewCountText } from "../generic/viewCountText";

export type CompactVideoRenderer = {
  videoId: string,
  /**
   * `食える飯が作りたい。~第2話~【はあちゃまクッキング・改】`
   */
  title: Text
  longBylineText: {
    runs: [
      {
        /**
         * `HAACHAMA Ch 赤井はあと`
         */
        text: string,
        navigationEndpoint: NavigationEndpoint
      }
    ]
  },
  /**
   * could be hidden??
   */
  viewCountText?: ViewCountText,
  /**
   * not defined when streaming
   * 
   * `7:09`
   */
  lengthText?: Text
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
