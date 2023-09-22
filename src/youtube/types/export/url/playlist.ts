import { ItemSectionRenderer } from "../renderer/itemSectionRenderer";
import { PlaylistHeaderRenderer } from "../renderer/playlistHeaderRenderer";
import * as playlistHeaderRenderer from "../renderer/playlistHeaderRenderer";
import { PlaylistSidebarRenderer } from "../renderer/playlistSidebarRenderer";
import { PlaylistVideoListRenderer } from "../renderer/playlistVideoListRenderer";
import * as playlistVideoListRenderer from "../renderer/playlistVideoListRenderer";
import { PlaylistVideoRenderer } from "../renderer/playlistVideoRenderer";
import { ReelItemRenderer } from "../renderer/reelItemRenderer";
import { RichGridRenderer } from "../renderer/richGridRenderer";
import { RichItemRenderer } from "../renderer/richItemRenderer";
import { SectionListRenderer } from "../renderer/sectionListRenderer";
import * as sectionListRenderer from "../renderer/sectionListRenderer";

export type Playlist = {
  innertubeApiKey: string | null,
  ytInitialData: YtInitialData | null,
  ytInitialPlayerResponse: null,
};



type YtInitialData = {
  [key: string]: unknown
  contents?: {
    twoColumnBrowseResultsRenderer: {
      tabs: [{
        tabRenderer: {
          content: {
            sectionListRenderer: SectionListRenderer<{
              content: {
                itemSectionRenderer: ItemSectionRenderer<{
                  messageRenderer?: {}
                  playlistVideoListRenderer?: PlaylistVideoListRenderer
                  richGridRenderer?: RichGridRenderer<{
                    richItemRenderer: RichItemRenderer<{
                      reelItemRenderer: ReelItemRenderer
                    }>
                  }>,
                }>
              }
            }>
          }
        }
      }]
    }
  }
  sidebar?: {
    playlistSidebarRenderer: PlaylistSidebarRenderer
  }
  header?: {
    playlistHeaderRenderer: PlaylistHeaderRenderer
  }
};



export function hasPlaylist(data: Playlist) {
  return !!data.ytInitialData?.contents?.twoColumnBrowseResultsRenderer
    .tabs[0].tabRenderer.content.sectionListRenderer;
}

export function getPlaylist(data: Playlist) {
  const header = data.ytInitialData?.header?.playlistHeaderRenderer;
  if (!header)
    throw new Error(`Header is not defined`);
  return playlistHeaderRenderer.getPlaylistInfo(header);
}

export async function* listAllVideos(data: Playlist, innertubeApiKey: string)
  : AsyncGenerator<{
    video?: PlaylistVideoRenderer
    shorts?: ReelItemRenderer
  }> {
  const section = data.ytInitialData?.contents?.twoColumnBrowseResultsRenderer
    .tabs[0].tabRenderer.content.sectionListRenderer;
  if (!section)
    throw new Error(`Section is not defined`);
  const contents = sectionListRenderer.getContents(section)[0]
    .itemSectionRenderer.contents;
  for (const content of contents) {
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
