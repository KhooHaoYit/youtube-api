import { Text } from "../generic/text";
import { ViewCountText } from "../generic/viewCountText";

export type ReelItemRenderer = {
  "videoId": string,
  /**
   * `【 子供の夢✨  】お菓子の山を作ってみたら大変なことになった...！？(完結編)【 #shorts 】`
   */
  headline: Text
  "viewCountText": ViewCountText,
};

export function getVideoId(data: ReelItemRenderer) {
  return data.videoId;
}
