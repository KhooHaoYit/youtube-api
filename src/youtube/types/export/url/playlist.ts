import { PageHeaderViewModel } from "../generic/models/pageHeaderViewModel";
import { PlaylistItemSection } from "../generic/playlistItemSection";
import { getBrowseId } from "../generic/runs";
import { getOriginalText, Text } from "../generic/text";
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
  metadata?: {
    playlistMetadataRenderer: {
      title: string
      description?: string
    }
  }
  header?: {
    playlistHeaderRenderer?: PlaylistHeaderRenderer
    pageHeaderRenderer?: {
      content: {
        pageHeaderViewModel: PageHeaderViewModel
      }
    }
  }
  alerts?: {
    alertRenderer?: AlertRenderer
    alertWithButtonRenderer?: AlertWithButtonRenderer
  }[]
  microformat?: {
    microformatDataRenderer: (
      { noindex: true }
      | {
        noindex: false
        urlCanonical: string
        title: string
        description: string
        unlisted: boolean
      }
    )
  }
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
  if (header)
    return playlistHeaderRenderer.getPlaylistInfo(header);
  if (data.ytInitialData?.microformat?.microformatDataRenderer.noindex === true)
    throw new Error(`Unable to get playlist`);
  const playlistSidebarPrimaryInfoRenderer =
    data.ytInitialData?.sidebar?.playlistSidebarRenderer.items
      .find(item => item.playlistSidebarPrimaryInfoRenderer)!
      .playlistSidebarPrimaryInfoRenderer!;
  const playlistSidebarSecondaryInfoRenderer =
    data.ytInitialData?.sidebar?.playlistSidebarRenderer.items
      .find(item => item.playlistSidebarSecondaryInfoRenderer)!
      .playlistSidebarSecondaryInfoRenderer!;
  return {
    id: data.ytInitialData!.microformat!.microformatDataRenderer.urlCanonical.replace(/^[^=]+/, ''),
    title: data.ytInitialData!.microformat!.microformatDataRenderer.title,
    description: data.ytInitialData!.metadata?.playlistMetadataRenderer.description ?? '',
    channelId: getBrowseId(
      playlistSidebarSecondaryInfoRenderer.videoOwner
        .videoOwnerRenderer.title.runs!
    ),
    visibility: data.ytInitialData!.microformat!.microformatDataRenderer.unlisted
      ? "UNLISTED" : "PUBLIC",
    badges: playlistSidebarPrimaryInfoRenderer.badges
      ?.map(badge => badge.metadataBadgeRenderer.label!),
    videoCount: +getOriginalText(playlistSidebarPrimaryInfoRenderer.stats[0]).replace(/,| [^]*/g, ''),
    viewCount: +getOriginalText(playlistSidebarPrimaryInfoRenderer.stats[1]).replace(/,| [^]*/g, ''),
    lastUpdated: getOriginalText(playlistSidebarPrimaryInfoRenderer.stats[2]),
  };
}
