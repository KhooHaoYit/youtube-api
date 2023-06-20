import * as backstage from "./backstagePostRenderer";
import { getOriginalText, Runs } from "../generic/runs";

export type SharedPostRenderer = {
  postId: string,
  content: { runs: Runs }
  originalPost: {
    backstagePostRenderer: backstage.BackstagePostRenderer
  }
};

export function getPostId(post: SharedPostRenderer) {
  return post.postId;
}

export function getSharedPostId(post: SharedPostRenderer) {
  return backstage.getPostId(post.originalPost.backstagePostRenderer);
}

export function getContent(post: SharedPostRenderer) {
  return getOriginalText(post.content.runs);
}
