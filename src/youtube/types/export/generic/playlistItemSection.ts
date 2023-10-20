import { ItemSectionRenderer } from "../renderer/itemSectionRenderer"
import { MessageRenderer } from "../renderer/messageRenderer"
import { PlaylistVideoListRenderer } from "../renderer/playlistVideoListRenderer"
import * as playlistVideoListRenderer from "../renderer/playlistVideoListRenderer"
import { PlaylistVideoRenderer } from "../renderer/playlistVideoRenderer"
import { ReelItemRenderer } from "../renderer/reelItemRenderer"
import { RichGridRenderer } from "../renderer/richGridRenderer"
import { RichItemRenderer } from "../renderer/richItemRenderer"

export type PlaylistItemSection = ItemSectionRenderer<{
  messageRenderer?: MessageRenderer
  playlistVideoListRenderer?: PlaylistVideoListRenderer
  richGridRenderer?: RichGridRenderer<{
    richItemRenderer: RichItemRenderer<{
      reelItemRenderer: ReelItemRenderer
    }>
  }>
}>

export async function* listAllVideos(data: PlaylistItemSection, innertubeApiKey: string)
  : AsyncGenerator<{
    video?: PlaylistVideoRenderer
    shorts?: ReelItemRenderer
  }> {
  for (const content of data.contents) {
    if (content.messageRenderer)
      continue;
    if (content.playlistVideoListRenderer)
      for await (const video of playlistVideoListRenderer.listAllVideos(content.playlistVideoListRenderer, innertubeApiKey))
        yield {
          video
        };
    else
      for (const { richItemRenderer } of content.richGridRenderer!.contents)
        yield {
          shorts: richItemRenderer.content.reelItemRenderer,
        };
  }
}
