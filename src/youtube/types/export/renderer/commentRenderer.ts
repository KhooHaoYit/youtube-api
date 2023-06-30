import { Image } from "../generic/image";
import { Runs } from "../generic/runs";

export type CommentRenderer = {
  commentId: string
  authorText: {
    simpleText: string
  }
  authorThumbnail: Image
  contentText: {
    runs: Runs
  }
  authorEndpoint: {
    browseId: string
  }
  publishedTimeText: {
    runs: Runs
  }
  // like count could be extracted
};
