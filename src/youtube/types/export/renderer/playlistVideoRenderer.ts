import { Image } from "../generic/image"
import { Runs } from "../generic/runs"
import * as runs from "../generic/runs"
import { Text } from "../generic/text";

export type PlaylistVideoRenderer = {
  videoId: string
  thumbnail: Image
  title: Text
  shortBylineText: { runs: Runs },
};

export function getVideoInfo(data: PlaylistVideoRenderer) {
  return {
    ownerId: runs.getBrowseId(data.shortBylineText.runs),
  };
}
