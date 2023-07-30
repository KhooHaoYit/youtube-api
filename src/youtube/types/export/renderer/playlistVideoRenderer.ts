import { Image } from "../generic/image"
import { Runs } from "../generic/runs"
import * as runs from "../generic/runs"

export type PlaylistVideoRenderer = {
  videoId: string
  thumbnail: Image
  title: { runs: Runs }
  shortBylineText: { runs: Runs },
};



export function getChannelId(data: PlaylistVideoRenderer) {
  return runs.getBrowseId(data.shortBylineText.runs);
}
