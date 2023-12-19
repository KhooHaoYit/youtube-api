import { PlaylistRenderer } from "../../renderer/playlistRenderer"
import { RichGridRenderer } from "../../renderer/richGridRenderer"
import { RichItemRenderer } from "../../renderer/richItemRenderer"

export type Podcasts = {
  title: 'Podcasts'
  content?: {
    richGridRenderer: RichGridRenderer<{
      content: {
        richItemRenderer: RichItemRenderer<{
          playlistRenderer: PlaylistRenderer
        }>
      }
    }>
  }
};
