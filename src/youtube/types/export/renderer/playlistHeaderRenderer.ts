import { Runs } from "../generic/runs";
import * as runs from "../generic/runs";
import { Text, getOriginalText } from "../generic/text";

export type PlaylistHeaderRenderer = {
  playlistId: string
  /**
   * `Members-only videos`
   */
  title: Text
  /**
   * `1,083 videos`
   */
  numVideosText: Text
  /**
   * `Videos available to members of this channel. Automatically updated.`
   */
  descriptionText?: Text
  /**
   * `No views`
   * `294,862 views`
   */
  viewCountText: Text
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
    title: getOriginalText(data.title),
    description: data.descriptionText
      ? getOriginalText(data.descriptionText)
      : '',
    channelId: data.ownerEndpoint?.browseEndpoint.browseId
      ?? null,
    visibility: data.privacy,
    badges: data.playlistBadges
      ?.map(badge => badge.metadataBadgeRenderer.label)
      ?? [],
    videoCount: +getOriginalText(data.numVideosText)
      .split(' ')[0]
      .replace(/,/g, ''),
    viewCount: (() => {
      const text = getOriginalText(data.viewCountText);
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
