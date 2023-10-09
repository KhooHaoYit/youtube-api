import { Text, getOriginalText } from "../generic/text";

export type GridPlaylistRenderer = {
  playlistId: string,
  title: Text
  /**
   * `1,133`
   */
  videoCountShortText: Text
};

export function getPlaylistId(data: GridPlaylistRenderer) {
  return data.playlistId;
}

export function getPlaylistTitle(data: GridPlaylistRenderer) {
  return getOriginalText(data.title);
}

export function getAmountOfVideos(data: GridPlaylistRenderer) {
  return +getOriginalText(data.videoCountShortText)
    .replace(/,/g, '');
}
