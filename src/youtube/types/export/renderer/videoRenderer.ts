import { Runs } from "../generic/runs";
import { Text, getOriginalText } from "../generic/text";
import { ViewCountText } from "../generic/viewCountText";
import { ChannelThumbnailWithLinkRenderer } from "./channelThumbnailWithLinkRenderer";

export type VideoRenderer = {
  /**
   * could be null from deleted video
   */
  videoId?: string,
  title: Text
  /**
   * contains partial description
   * 
   * might not be visible (like in membership tab)
   */
  "descriptionSnippet"?: {},
  /**
   * not defined on videos tab
   */
  longBylineText?: Text
  /**
   * might not be visible (like in membership tab)
   */
  "viewCountText"?: ViewCountText,
  /**
   * not defined on videos tab
   */
  "channelThumbnailSupportedRenderers"?: {
    channelThumbnailWithLinkRenderer: ChannelThumbnailWithLinkRenderer
  },
};

export function getChannelName(data: VideoRenderer) {
  if (!data.longBylineText)
    return;
  return getOriginalText(data.longBylineText);
}

export function getVideoId(data: VideoRenderer) {
  return data.videoId;
}
