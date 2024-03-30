import { Image } from "../generic/image";
import { Runs } from "../generic/runs";
import { Text } from "../generic/text";
import { LiveChatAuthorBadgeRenderer } from "./liveChatAuthorBadgeRenderer";

export type LiveChatTextMessageRenderer = {
  id: string
  timestampUsec: string
  authorExternalChannelId: string
  message: Text
  authorName: Text
  authorPhoto: Image
  authorBadges?: {
    liveChatAuthorBadgeRenderer:LiveChatAuthorBadgeRenderer
  }[]
};
