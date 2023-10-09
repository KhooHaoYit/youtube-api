import { Runs } from "../generic/runs";
import * as runs from "../generic/runs";
import { Text } from "../generic/text";

export type PlaylistRenderer = {
  /**
   * `PL4E0JrsYQEAImmPxsdxZTjQik9gdL_v3W`
   */
  "playlistId": string,
  /**
   * `#子豚相談室`
   */
  title: Text
  /**
   * `76`
   */
  "videoCount": string,
  /**
   * not defined in podcast tab
   */
  "longBylineText"?: {
    "runs": Runs,
  },
};

export function getPlaylistInfo(data: PlaylistRenderer) {
  return {
    id: data.playlistId,
    extraChannelIds: data.longBylineText?.runs
      .map(run => {
        const browseId = runs.getBrowseId([run]);
        if (!browseId)
          return;
        return [
          runs.getOriginalText([run]),
          browseId,
        ] as [channelName: string, channelId: string];
      })
      .filter(Boolean),
  };
}
