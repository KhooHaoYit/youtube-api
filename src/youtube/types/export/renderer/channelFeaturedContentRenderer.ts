import { VideoRenderer } from "./videoRenderer";
import * as videoRenderer from "./videoRenderer";

export type ChannelFeaturedContentRenderer = {
  items: {
    "videoRenderer": VideoRenderer
  }[],
};

export function getVideoIds(data: ChannelFeaturedContentRenderer) {
  return data.items
    .map(item => videoRenderer.getVideoId(item.videoRenderer));
}
