import { PlaylistRenderer } from "../../renderer/playlistRenderer";
import { RichGridRenderer } from "../../renderer/richGridRenderer";
import { RichItemRenderer } from "../../renderer/richItemRenderer";

export type Releases = {
  title: 'Releases'
  content?: {
    richGridRenderer: RichGridRenderer<{
      richItemRenderer: RichItemRenderer<{
        playlistRenderer: PlaylistRenderer
      }>
    }>
  }
};

