export type GridPlaylistRenderer = {
  playlistId: string,
  title: {
    runs: [{ text: string }],
  },
  videoCountShortText: {
    /**
     * `1,133`
     */
    simpleText: string,
  },
};
