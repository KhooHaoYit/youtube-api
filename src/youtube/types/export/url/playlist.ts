import { ContinuationItemRenderer } from "../renderer/continuationItemRenderer";
import { ItemSectionRenderer } from "../renderer/itemSectionRenderer";
import { PlaylistHeaderRenderer } from "../renderer/playlistHeaderRenderer";
import * as playlistHeaderRenderer from "../renderer/playlistHeaderRenderer";
import { PlaylistSidebarPrimaryInfoRenderer } from "../renderer/playlistSidebarPrimaryInfoRenderer";
import { PlaylistSidebarSecondaryInfoRenderer } from "../renderer/playlistSidebarSecondaryInfoRenderer";
import { PlaylistVideoListRenderer } from "../renderer/playlistVideoListRenderer";
import * as playlistVideoListRenderer from "../renderer/playlistVideoListRenderer";
import { SectionListRenderer } from "../renderer/sectionListRenderer";
import * as sectionListRenderer from "../renderer/sectionListRenderer";

export type Playlist = {
  innertubeApiKey: string | null,
  ytInitialData: YtInitialData | null,
  ytInitialPlayerResponse: null,
};



type YtInitialData = {
  contents: {
    twoColumnBrowseResultsRenderer: {
      tabs: [{
        tabRenderer: {
          content: {
            sectionListRenderer: SectionListRenderer<{
              content: {
                itemSectionRenderer: ItemSectionRenderer<{
                  playlistVideoListRenderer: PlaylistVideoListRenderer
                }>
              }
            }>
          }
        }
      }]
    }
  }
  sidebar: {
    playlistSidebarRenderer: {
      items: {
        playlistSidebarPrimaryInfoRenderer?: PlaylistSidebarPrimaryInfoRenderer
        playlistSidebarSecondaryInfoRenderer?: PlaylistSidebarSecondaryInfoRenderer
      }[]
    }
  }
  header: {
    playlistHeaderRenderer: PlaylistHeaderRenderer
  }
};



export function hasPlaylist(data: Playlist) {
  return !!data.ytInitialData?.contents.twoColumnBrowseResultsRenderer
    .tabs[0].tabRenderer.content.sectionListRenderer;
}

export function getPlaylist(data: Playlist) {
  const header = data.ytInitialData?.header.playlistHeaderRenderer;
  if (!header)
    throw new Error(`Header is not defined`);
  return {
    id: playlistHeaderRenderer.getPlaylistId(header),
    channelId: playlistHeaderRenderer.getChannelId(header),
    description: playlistHeaderRenderer.getDescription(header),
    lastUpdated: playlistHeaderRenderer.getLastUpdated(header),
    title: playlistHeaderRenderer.getTitle(header),
    videoCount: playlistHeaderRenderer.getVideoCount(header),
    viewCount: playlistHeaderRenderer.getViewCount(header),
    visibility: playlistHeaderRenderer.getVisibility(header),
  };
}

export async function* listAllVideos(data: Playlist, innertubeApiKey: string) {
  const section = data.ytInitialData?.contents.twoColumnBrowseResultsRenderer
    .tabs[0].tabRenderer.content.sectionListRenderer;
  if (!section)
    throw new Error(`Section is not defined`);
  const playlist = sectionListRenderer.getContents(section)[0]
    .itemSectionRenderer.contents[0]
    .playlistVideoListRenderer;
  for await (const video of playlistVideoListRenderer.listAllVideos(playlist, innertubeApiKey))
    yield video;
}
