import { ResponseContext } from "../generic/responseContext";
import { AboutChannelRenderer } from "../renderer/aboutChannelRenderer";
import { C4TabbedHeaderRenderer } from "../renderer/c4TabbedHeaderRenderer";
import { EngagementPanelSectionListRenderer } from "../renderer/engagementPanelSectionListRenderer";
import { VideoPrimaryInfoRenderer } from "../renderer/videoPrimaryInfoRenderer";
import { VideoSecondaryInfoRenderer } from "../renderer/videoSecondaryInfoRenderer";
import { Channels } from "./channelTab/channels";
import { Community } from "./channelTab/community";
import { Home } from "./channelTab/home";
import { Live } from "./channelTab/live";
import { Membership } from "./channelTab/membership";
import { Playlists } from "./channelTab/playlists";
import { Podcasts } from "./channelTab/podcasts";
import { Releases } from "./channelTab/releases";
import { Search } from "./channelTab/search";
import { Shorts } from "./channelTab/shorts";
import { Store } from "./channelTab/store";
import { Videos } from "./channelTab/videos";

export type Channel = {
  innertubeApiKey: string | null,
  // null when channel doesn't exists
  ytInitialData: YtInitialData | null,
  ytInitialPlayerResponse: null,
};



export type YtInitialData = {
  responseContext: ResponseContext
  /**
   * defined only when requesting /channel/CHANNEL_ID
   */
  header?: { c4TabbedHeaderRenderer: C4TabbedHeaderRenderer }
  /**
   * not defined when channel doesn't exists
   */
  contents?: {
    twoColumnBrowseResultsRenderer?: {
      tabs: {
        tabRenderer?:
        | Home
        | Channels
        | Playlists
        // | About
        | Community
        | Membership
        | Releases
        | Videos
        | Live
        | Shorts
        | Podcasts
        | Store
        expandableTabRenderer?: Search
      }[]
    }
    twoColumnWatchNextResults?: {
      results: {
        results: {
          contents: {
            videoPrimaryInfoRenderer?: VideoPrimaryInfoRenderer
            videoSecondaryInfoRenderer?: VideoSecondaryInfoRenderer
            itemSectionRenderer?: {}
          }[]
        }
      }
    }
  }
  onResponseReceivedEndpoints?: {
    showEngagementPanelEndpoint?: {
      engagementPanel: {
        engagementPanelSectionListRenderer: EngagementPanelSectionListRenderer<{
          aboutChannelRenderer: AboutChannelRenderer
        }>
      }
    }
    signalServiceEndpoint?: {}
    loadMarkersCommand?: {}
  }[]
};
