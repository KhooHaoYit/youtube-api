export type GridPlaylistRenderer = {
  playlistId: string,
  title: {
    runs: [{ text: string }],
  },
  videoCountShortText: {
    /**
     * `8`
     */
    simpleText: string,
  },
};
