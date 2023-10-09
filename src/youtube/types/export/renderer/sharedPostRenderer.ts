import * as backstage from "./backstagePostRenderer";
import { Text, getOriginalText } from "../generic/text";

export type SharedPostRenderer = {
  postId: string,
  content: Text
  /**
   * not defined if post is deleted
   */
  originalPost?: {
    backstagePostRenderer: backstage.BackstagePostRenderer
  }
  /**
   * `shared 2 days ago`
   */
  publishedTimeText: Text
};

export function getPostId(post: SharedPostRenderer) {
  return post.postId;
}

export function getSharedPostId(post: SharedPostRenderer) {
  const originalPost = post.originalPost?.backstagePostRenderer;
  if (!originalPost)
    return null;
  return backstage.getPostId(originalPost);
}

export function getContent(post: SharedPostRenderer) {
  return getOriginalText(post.content);
}

export function getPublishedTime(post: SharedPostRenderer) {
  return getOriginalText(post.publishedTimeText);
}
