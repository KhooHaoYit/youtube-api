import { Image } from "../generic/image";
import { getOriginalText, Runs } from "../generic/runs";
import { ViewCountText } from "../generic/viewCountText";

export type VideoRenderer = {
  "videoId": string,
  "title": {
    "runs": Runs,
    /**
     * contains information on total views
     */
    "accessibility": {}
  },
  /**
   * contains partial description
   * 
   * might not be visible (like in membership tab)
   */
  "descriptionSnippet"?: {},
  "longBylineText": {
    "runs": Runs,
  },
  /**
   * might not be visible (like in membership tab)
   */
  "viewCountText"?: ViewCountText,
  "channelThumbnailSupportedRenderers": {
    "channelThumbnailWithLinkRenderer": {
      "thumbnail": Image
      "navigationEndpoint": {
        "browseEndpoint": {
          /**
           * `UCAPdxmEjYxUdQMf_JaQRl1Q`
           */
          "browseId": string,
          /**
           * `/@manae_nme`
           */
          "canonicalBaseUrl"?: string
        }
      },
    }
  },
};

export function getChannelName(data: VideoRenderer) {
  return getOriginalText(data.longBylineText.runs);
}

export function getVideoId(data: VideoRenderer) {
  return data.videoId;
}
