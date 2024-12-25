import { BackstageImageRenderer, getImageUrl } from "./backstageImageRenderer";
import { PlaylistRenderer, getPlaylistInfo } from "./playlistRenderer";
import { VideoRenderer } from "./videoRenderer";
import { StringOfDigitsAndComma } from "../generic/stringOfDigitsAndComma";
import { PostMultiImageRenderer, getAllImageUrls } from "./postMultiImageRenderer";
import { PollRenderer, getPollInfo } from "./pollRenderer";
import { SponsorsOnlyBadgeRenderer } from "./sponsorsOnlyBadgeRenderer";
import { QuizRenderer, getQuizInfo } from "./quizRenderer";
import { Text, getOriginalText } from "../generic/text";

export type BackstagePostRenderer = {
  postId: string,
  contentText: Text
  authorEndpoint: {
    browseEndpoint: {
      browseId: string,
    }
  }
  backstageAttachment?: {
    pollRenderer?: PollRenderer
    postMultiImageRenderer?: PostMultiImageRenderer
    backstageImageRenderer?: BackstageImageRenderer
    videoRenderer?: VideoRenderer,
    playlistRenderer?: PlaylistRenderer,
    quizRenderer?: QuizRenderer
  }
  "actionButtons": {
    "commentActionButtonsRenderer": {
      "likeButton": {
        "toggleButtonRenderer": {
          "accessibility": {
            /**
             * `9,455`
             */
            "label": `Like this post along with ${StringOfDigitsAndComma} other people`
          },
        },
      },
      // not defined when unable to reply (still possible to get reply count by accessing the post indirectly)
      replyButton?: {
        "buttonRenderer": {
          // not defined when there's no comment
          "text"?: {
            "accessibility": {
              "accessibilityData": {
                "label": `${string} comment${'s' | ''}`,
              }
            },
          }
          [key: string]: unknown,
        }
      }
    },
  },
  publishedTimeText: Text
  sponsorsOnlyBadge?: {
    sponsorsOnlyBadgeRenderer: SponsorsOnlyBadgeRenderer
  }
};

export function getPostId(post: BackstagePostRenderer) {
  return post.postId;
}

export function getReplyCount(post: BackstagePostRenderer) {
  const replyButton = post.actionButtons.commentActionButtonsRenderer.replyButton;
  if (!replyButton)
    return undefined;
  const text = replyButton.buttonRenderer.text
    ?.accessibility.accessibilityData.label
    .match(/\d+/)?.[0]
    ?? '0';
  return +text;
}

export function getPublishedTime(post: BackstagePostRenderer) {
  return getOriginalText(post.publishedTimeText);
  // if (/^\d+ seconds ago$/.test(text))
  //   return Date.now() - +text.match(/\d+/)![0];
  // throw new Error(`Unable to parse relative date: ${text}`);
}

export function getContent(post: BackstagePostRenderer) {
  if (!post.contentText)
    return;
  return getOriginalText(post.contentText);
}

type Extra =
  | null
  | ['image', string[]]
  | ['video', string | null]
  | ['playlist', string]
  | ['poll', ReturnType<typeof getPollInfo>]
  | ['quiz', ReturnType<typeof getQuizInfo>];
export function getExtra(post: BackstagePostRenderer): Extra {
  const extra = post.backstageAttachment;
  if (!extra)
    return null;
  if (extra?.backstageImageRenderer)
    return ['image', [getImageUrl(extra.backstageImageRenderer)]];
  if (extra?.postMultiImageRenderer)
    return ['image', getAllImageUrls(extra.postMultiImageRenderer)];
  if (extra?.videoRenderer)
    return ['video', extra.videoRenderer.videoId ?? null];
  if (extra.playlistRenderer)
    return ['playlist', getPlaylistInfo(extra.playlistRenderer).id];
  if (extra?.pollRenderer)
    return ['poll', getPollInfo(extra.pollRenderer)];
  if (extra?.quizRenderer)
    return ['quiz', getQuizInfo(extra.quizRenderer)];
  throw new Error(`Unknown extra`);
}

export function getLikeCount(post: BackstagePostRenderer) {
  // what happened on 0 like post
  return +post.actionButtons.commentActionButtonsRenderer
    .likeButton.toggleButtonRenderer.accessibility.label
    .match(/[0-9,]+/)![0]
    .replace(/,/g, '');
}
