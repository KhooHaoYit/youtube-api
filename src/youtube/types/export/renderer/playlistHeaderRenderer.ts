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
    simpleText?: string
  }
  viewCountText: {
    /**
     * `No views`
     * `294,862 views`
     */
    simpleText: string
  }
  privacy: 'PUBLIC' | 'UNLISTED'
  byline: {
    playlistBylineRenderer: {
      text: {
        /**
         * `46 views`
         */
        simpleText?: string
        // TODO: check 0 & 1 video
        /**
         * `Last updated on Jun 20, 2023` | `Updated today`
         * 
         * `6 videos`
         */
        runs?: Runs
      }
    }
  }[]
  ownerEndpoint?: {
    browseEndpoint: {
      browseId: string
    }
  }
  playlistBadges?: {
    metadataBadgeRenderer: {
      label: string
    }
  }[]
};



export function getPlaylistInfo(data: PlaylistHeaderRenderer) {
  return {
    id: data.playlistId,
    title: data.title.simpleText,
    description: data.descriptionText?.simpleText ?? '',
    channelId: data.ownerEndpoint?.browseEndpoint.browseId
      ?? null,
    visibility: data.privacy,
    badges: data.playlistBadges
      ?.map(badge => badge.metadataBadgeRenderer.label)
      ?? [],
    videoCount: +runs.getOriginalText(data.numVideosText.runs)
      .split(' ')[0]
      .replace(/,/g, ''),
    viewCount: (() => {
      const text = data.viewCountText.simpleText;
      if (text === 'No views')
        return 0;
      return +text
        .split(' ')[0]
        .replace(/,/g, '');
    })(),
    lastUpdated: (() => {
      let lastUpdated: string | undefined;
      for (const { playlistBylineRenderer } of data.byline) {
        const textRuns = playlistBylineRenderer.text.runs;
        if (!textRuns)
          continue;
        const text = runs.getOriginalText(textRuns);
        if (text.indexOf('video') !== -1)
          continue;
        lastUpdated = text;
        break;
      }
      return lastUpdated;
    })(),
  }
}
