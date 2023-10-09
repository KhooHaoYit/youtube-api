import { Text } from "../generic/text";
import { SegmentedLikeDislikeButtonRenderer } from "./segmentedLikeDislikeButtonRenderer";
import { VideoViewCountRenderer } from "./videoViewCountRenderer";

export type VideoPrimaryInfoRenderer = {
  /**
   * Delicious Yummy Tasty GYOZA!!!
   */
  title: Text
  viewCount?: {
    videoViewCountRenderer: VideoViewCountRenderer
  }
  videoActions: {
    menuRenderer: {
      topLevelButtons: {
        buttonRenderer?: {}
        segmentedLikeDislikeButtonRenderer?: SegmentedLikeDislikeButtonRenderer
      }[],
    }
  },
  /**
   * Dec 15, 2022
   */
  dateText: Text
};


