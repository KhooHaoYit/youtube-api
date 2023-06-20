import * as backstage from "./backstagePostRenderer";
import * as shared from "./sharedPostRenderer";

export type BackstagePostThreadRenderer = {
  post: {
    backstagePostRenderer?: backstage.BackstagePostRenderer,
    sharedPostRenderer?: shared.SharedPostRenderer,
  }
};

export function getPost({ post }: BackstagePostThreadRenderer) {
  if (post.backstagePostRenderer)
    return {
      postId: backstage.getPostId(post.backstagePostRenderer),
      content: backstage.getContent(post.backstagePostRenderer),
      extra: backstage.getExtra(post.backstagePostRenderer),
      likeCount: backstage.getLikeCount(post.backstagePostRenderer),
      replyCount: backstage.getReplyCount(post.backstagePostRenderer),
      publishedTime: backstage.getPublishedTime(post.backstagePostRenderer),
    };
  if (post.sharedPostRenderer)
    return {
      postId: shared.getPostId(post.sharedPostRenderer),
      content: shared.getContent(post.sharedPostRenderer),
      publishedTime: shared.getPublishedTime(post.sharedPostRenderer),
      extra: [
        'share',
        shared.getSharedPostId(post.sharedPostRenderer),
      ] as ['share', string],
    };
  throw new Error(`Unknown post`);
}
