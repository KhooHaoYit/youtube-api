import { Runs } from "../generic/runs";

export type PlaylistRenderer = {
  /**
   * `PL4E0JrsYQEAImmPxsdxZTjQik9gdL_v3W`
   */
  "playlistId": string,
  "title": {
    /**
     * `#子豚相談室`
     */
    "simpleText": string
  },
  /**
   * `76`
   */
  "videoCount": string,
  /**
   * not defined in podcast tab
   */
  "longBylineText"?: {
    /**
     * `[
     *   {
     *     "navigationEndpoint": {
     *       "browseEndpoint": {
     *         "browseId": "UCeShTCVgZyq2lsBW9QwIJcw",
     *         "canonicalBaseUrl": "/@GundoMirei"
     *       }
     *     }
     *   }
     * ]`
     */
    "runs": Runs,
  },
};

export function getPlaylistId(data: PlaylistRenderer) {
  return data.playlistId;
}

export function getPlaylistOwnerId(data: PlaylistRenderer) {
  return data.longBylineText?.runs[0].navigationEndpoint?.browseEndpoint?.browseId;
}
