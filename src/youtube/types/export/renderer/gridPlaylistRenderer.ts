import { getOriginalText, Runs } from "../generic/runs";

export type GridPlaylistRenderer = {
  playlistId: string,
  title: {
    runs: Runs,
  },
  videoCountShortText: {
    /**
     * `1,133`
     */
    simpleText: string,
  },
};

export function getPlaylistId(data: GridPlaylistRenderer) {
  return data.playlistId;
}

export function getPlaylistTitle(data: GridPlaylistRenderer) {
  return getOriginalText(data.title.runs);
}

export function getAmountOfVideos(data: GridPlaylistRenderer) {
  return +data.videoCountShortText.simpleText.replace(/,/g, '');
}
