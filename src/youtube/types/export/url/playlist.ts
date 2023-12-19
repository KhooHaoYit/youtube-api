import { PlaylistItemSection } from "../generic/playlistItemSection";
import { getOriginalText } from "../generic/text";
import { AlertRenderer } from "../renderer/alertRenderer";
import { AlertWithButtonRenderer } from "../renderer/alertWithButtonRenderer";
import { ContinuationItemRenderer } from "../renderer/continuationItemRenderer";
import { PlaylistHeaderRenderer } from "../renderer/playlistHeaderRenderer";
import * as playlistHeaderRenderer from "../renderer/playlistHeaderRenderer";
import { PlaylistSidebarRenderer } from "../renderer/playlistSidebarRenderer";
import { SectionListRenderer } from "../renderer/sectionListRenderer";

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
  alerts?: {
    alertRenderer?: AlertRenderer
    alertWithButtonRenderer?: AlertWithButtonRenderer
  }[]
};


export function getUnviewableReason(data: Playlist) {
  const alert = data.ytInitialData?.alerts?.[0].alertRenderer;
  if (!alert)
    return null;
  return getOriginalText(alert.text);
}

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
