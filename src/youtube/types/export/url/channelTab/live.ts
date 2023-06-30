import { ContinuationItemRenderer } from "../../renderer/continuationItemRenderer";
import { RichGridRenderer } from "../../renderer/richGridRenderer";
import { RichItemRenderer } from "../../renderer/richItemRenderer";
import { VideoRenderer } from "../../renderer/videoRenderer";

export type Live = {
  title: 'Live',
  content?: {
    richGridRenderer: RichGridRenderer<{
      richItemRenderer?: RichItemRenderer<{
        videoRenderer: VideoRenderer,
      }>
      continuationItemRenderer?: ContinuationItemRenderer,
    }>
  }
};
