import { Runs } from "../generic/runs";
import { ViewCountText } from "../generic/viewCountText";

export type ChannelVideoPlayerRenderer = {
  "videoId": string,
  "title": {
    "runs": [{
      /**
       * `僕が死のうと思ったのは - 中島美嘉(Cover)／まなえ`
       */
      "text": string,
    }],
  },
  "description": {
    runs: Runs,
  },
  "viewCountText": ViewCountText,
  "publishedTimeText": {
    "runs": [{
      /**
       * `5 months ago`
       */
      "text": string
    }]
  },
};

export function getVideoId(data: ChannelVideoPlayerRenderer) {
  return data.videoId;
}
