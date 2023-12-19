import { ChipCloudChipRenderer } from "../../renderer/chipCloudChipRenderer";
import { ContinuationItemRenderer } from "../../renderer/continuationItemRenderer"
import { FeedFilterChipBarRenderer } from "../../renderer/feedFilterChipBarRenderer";
import { RichGridRenderer } from "../../renderer/richGridRenderer"
import { RichItemRenderer } from "../../renderer/richItemRenderer"
import { VideoRenderer } from "../../renderer/videoRenderer"

export type Videos = {
  title: 'Videos'
  content?: {
    richGridRenderer: RichGridRenderer<{
      content: {
        richItemRenderer?: RichItemRenderer<{
          videoRenderer?: VideoRenderer
        }>
        continuationItemRenderer?: ContinuationItemRenderer
      }
      header: {
        feedFilterChipBarRenderer: FeedFilterChipBarRenderer<{
          content: {
            chipCloudChipRenderer: ChipCloudChipRenderer
          }
        }>
      }
    }>
  }
};

