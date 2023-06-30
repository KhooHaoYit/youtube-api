import { Image } from "../generic/image";
import { Runs } from "../generic/runs";
import { LiveChatAuthorBadgeRenderer } from "./liveChatAuthorBadgeRenderer";

export type LiveChatSponsorshipsHeaderRenderer = {
  authorPhoto: Image
  primaryText: {
    runs: Runs
  }
  authorBadges: {
    liveChatAuthorBadgeRenderer: LiveChatAuthorBadgeRenderer
  }[]
};


