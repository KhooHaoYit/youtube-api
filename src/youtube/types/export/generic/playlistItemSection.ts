import { ItemSectionRenderer } from "../renderer/itemSectionRenderer"
import { MessageRenderer } from "../renderer/messageRenderer"
import { PlaylistShowMetadataRenderer } from "../renderer/playlistShowMetadataRenderer"
import { PlaylistVideoListRenderer } from "../renderer/playlistVideoListRenderer"
import * as playlistVideoListRenderer from "../renderer/playlistVideoListRenderer"
import { PlaylistVideoRenderer } from "../renderer/playlistVideoRenderer"
import { RichGridRenderer } from "../renderer/richGridRenderer"
import { RichItemRenderer } from "../renderer/richItemRenderer"
import { ShortsLockupViewModel } from "./models/shortsLockupViewModel"

export type PlaylistItemSection = ItemSectionRenderer<{
  messageRenderer?: MessageRenderer
  playlistVideoListRenderer?: PlaylistVideoListRenderer
  playlistShowMetadataRenderer?: PlaylistShowMetadataRenderer
  richGridRenderer?: RichGridRenderer<{
    content: {
      richItemRenderer: RichItemRenderer<{
        shortsLockupViewModel: ShortsLockupViewModel
      }>
    }
  }>
}>

export async function* listAllVideos(data: PlaylistItemSection, innertubeApiKey: string)
  : AsyncGenerator<{
    video?: PlaylistVideoRenderer
    shorts?: ShortsLockupViewModel
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
          shorts: richItemRenderer.content.shortsLockupViewModel,
        };
  }
}
