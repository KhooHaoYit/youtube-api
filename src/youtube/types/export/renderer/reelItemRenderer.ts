import { ViewCountText } from "../generic/viewCountText";

export type ReelItemRenderer = {
  "videoId": string,
  "headline": {
    /**
     * `【 子供の夢✨  】お菓子の山を作ってみたら大変なことになった...！？(完結編)【 #shorts 】`
     */
    "simpleText": string
  },
  "viewCountText": ViewCountText,
};

export function getVideoId(data: ReelItemRenderer) {
  return data.videoId;
}
