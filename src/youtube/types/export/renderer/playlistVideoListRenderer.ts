import { ContinuationItemRenderer } from "./continuationItemRenderer";
import * as continuationItemRenderer from "./continuationItemRenderer";
import { PlaylistVideoRenderer } from "./playlistVideoRenderer";

export type PlaylistVideoListRenderer = {
  playlistId: string
  contents: {
    playlistVideoRenderer?: PlaylistVideoRenderer
    continuationItemRenderer?: ContinuationItemRenderer
  }[]
};

export async function* listAllVideos(data: PlaylistVideoListRenderer, innertubeApiKey: string) {
  for await (const video of continuationItemRenderer.listAll(data.contents, innertubeApiKey))
    yield video.playlistVideoRenderer!;
}
