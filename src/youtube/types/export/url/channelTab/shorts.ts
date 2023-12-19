import { ContinuationItemRenderer } from "../../renderer/continuationItemRenderer";
import { ReelItemRenderer } from "../../renderer/reelItemRenderer";
import { RichGridRenderer } from "../../renderer/richGridRenderer";
import { RichItemRenderer } from "../../renderer/richItemRenderer";

export type Shorts = {
  title: 'Shorts',
  content?: {
    richGridRenderer: RichGridRenderer<{
      content: {
        richItemRenderer?: RichItemRenderer<{
          reelItemRenderer: ReelItemRenderer
        }>
        continuationItemRenderer?: ContinuationItemRenderer
      }
    }>
  }
};
