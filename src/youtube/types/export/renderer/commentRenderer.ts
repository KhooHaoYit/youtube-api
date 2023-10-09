import { Image } from "../generic/image";
import { Text } from "../generic/text";

export type CommentRenderer = {
  commentId: string
  authorText: Text
  authorThumbnail: Image
  contentText: Text
  authorEndpoint: {
    browseId: string
  }
  publishedTimeText: Text
  // like count could be extracted
};
