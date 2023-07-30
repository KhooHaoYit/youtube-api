import { Runs } from "../generic/runs";
import * as runs from "../generic/runs";

export type PlaylistHeaderRenderer = {
  playlistId: string
  title: {
    /**
     * `Members-only videos`
     */
    simpleText: string
  }
  numVideosText: {
    /**
     * `1,083 videos`
     */
    runs: Runs
  }
  descriptionText?: {
    /**
     * `Videos available to members of this channel. Automatically updated.`
     */
    simpleText: string
  }
  viewCountText: {
    /**
     * `294,862 views`
     */
    simpleText: string
  }
  privacy: 'PUBLIC' | 'UNLISTED'
  byline: [
    {},
    {},
    {
      playlistBylineRenderer: {
        text: {
          /**
           * `Last updated on Jun 20, 2023` | `Updated today`
           */
          runs: Runs
        }
      }
    },
  ]
  ownerEndpoint: {
    browseEndpoint: {
      browseId: string
    }
  }
};



export function getPlaylistId(data: PlaylistHeaderRenderer) {
  return data.playlistId;
}

export function getVideoCount(data: PlaylistHeaderRenderer) {
  return +runs.getOriginalText(data.numVideosText.runs)
    .split(' ')[0]
    .replace(/,/g, '');
}

export function getViewCount(data: PlaylistHeaderRenderer) {
  return +data.viewCountText.simpleText
    .split(' ')[0]
    .replace(/,/g, '');
}

export function getLastUpdated(data: PlaylistHeaderRenderer) {
  return runs.getOriginalText(data.byline[2].playlistBylineRenderer.text.runs);
}

export function getDescription(data: PlaylistHeaderRenderer) {
  return data.descriptionText?.simpleText ?? '';
}

export function getChannelId(data: PlaylistHeaderRenderer) {
  return data.ownerEndpoint.browseEndpoint.browseId;
}

export function getVisibility(data: PlaylistHeaderRenderer) {
  return data.privacy;
}

export function getTitle(data: PlaylistHeaderRenderer) {
  return data.title.simpleText;
}
