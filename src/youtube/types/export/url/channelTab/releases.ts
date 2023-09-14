import { PlaylistRenderer, getPlaylistInfo } from "../../renderer/playlistRenderer";
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

export function getReleases(data: Releases) {
  return data.content?.richGridRenderer.contents.map(({ richItemRenderer }) =>
    getPlaylistInfo(richItemRenderer.content.playlistRenderer));
}
