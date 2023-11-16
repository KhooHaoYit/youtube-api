import { PlaylistItemSection } from "../generic/playlistItemSection";
import { ContinuationItemRenderer } from "../renderer/continuationItemRenderer";
import { PlaylistHeaderRenderer } from "../renderer/playlistHeaderRenderer";
import * as playlistHeaderRenderer from "../renderer/playlistHeaderRenderer";
import { PlaylistSidebarRenderer } from "../renderer/playlistSidebarRenderer";
import * as playlistVideoListRenderer from "../renderer/playlistVideoListRenderer";
import { PlaylistVideoRenderer } from "../renderer/playlistVideoRenderer";
import { ReelItemRenderer } from "../renderer/reelItemRenderer";
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
                itemSectionRenderer?: PlaylistItemSection
                continuationItemRenderer?: ContinuationItemRenderer
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
