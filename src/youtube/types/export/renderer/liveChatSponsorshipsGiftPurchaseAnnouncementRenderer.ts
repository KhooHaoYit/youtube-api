import { LiveChatSponsorshipsHeaderRenderer } from "./liveChatSponsorshipsHeaderRenderer";

export type LiveChatSponsorshipsGiftPurchaseAnnouncementRenderer = {
  id: string
  timestampUsec: string
  authorExternalChannelId: string
  header: {
    liveChatSponsorshipsHeaderRenderer: LiveChatSponsorshipsHeaderRenderer
  }
};

export function getMessageId(data: LiveChatSponsorshipsGiftPurchaseAnnouncementRenderer) {
  return data.id;
}

export function getMessageTimestamp(data: LiveChatSponsorshipsGiftPurchaseAnnouncementRenderer) {
  return data.timestampUsec;
}
