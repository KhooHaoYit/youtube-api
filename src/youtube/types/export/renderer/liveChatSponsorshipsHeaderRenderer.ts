import { Image } from "../generic/image";
import { Text } from "../generic/text";
import { LiveChatAuthorBadgeRenderer } from "./liveChatAuthorBadgeRenderer";

export type LiveChatSponsorshipsHeaderRenderer = {
  authorPhoto: Image
  primaryText: Text
  authorBadges: {
    liveChatAuthorBadgeRenderer: LiveChatAuthorBadgeRenderer
  }[]
};


