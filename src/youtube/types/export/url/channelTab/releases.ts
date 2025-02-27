import { ContinuationItemRenderer } from "../../renderer/continuationItemRenderer";
import { PlaylistRenderer, getPlaylistInfo } from "../../renderer/playlistRenderer";
import { RichGridRenderer } from "../../renderer/richGridRenderer";
import { RichItemRenderer } from "../../renderer/richItemRenderer";

export type Releases = {
  title: 'Releases'
  content?: {
    richGridRenderer: RichGridRenderer<{
      content: {
        richItemRenderer?: RichItemRenderer<{
          playlistRenderer: PlaylistRenderer
        }>
        continuationItemRenderer?: ContinuationItemRenderer
      }
    }>
  }
};
