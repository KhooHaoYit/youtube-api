import { ContinuationItemRenderer } from "../../renderer/continuationItemRenderer"
import { RichGridRenderer } from "../../renderer/richGridRenderer"
import { RichItemRenderer } from "../../renderer/richItemRenderer"
import { VideoRenderer } from "../../renderer/videoRenderer"

export type Videos = {
  title: 'Videos'
  content?: {
    richGridRenderer: RichGridRenderer<{
      richItemRenderer?: RichItemRenderer<{
        videoRenderer?: VideoRenderer
      }>
      continuationItemRenderer?: ContinuationItemRenderer
    }>
  }
};

