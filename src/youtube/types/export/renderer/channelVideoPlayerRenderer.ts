import { Runs } from "../generic/runs";
import { Text } from "../generic/text";
import { ViewCountText } from "../generic/viewCountText";

export type ChannelVideoPlayerRenderer = {
  videoId: string,
  /**
   * `僕が死のうと思ったのは - 中島美嘉(Cover)／まなえ`
   */
  title: Text
  description: Text
  viewCountText?: ViewCountText,
  /**
   * `5 months ago`
   */
  publishedTimeText?: Text
};

export function getVideoId(data: ChannelVideoPlayerRenderer) {
  return data.videoId;
}
