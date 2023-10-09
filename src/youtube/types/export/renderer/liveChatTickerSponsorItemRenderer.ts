import { Text, getOriginalText } from "../generic/text";

export type LiveChatTickerSponsorItemRenderer = {
  id: string,
  authorExternalChannelId: string
  durationSec: number
  showItemEndpoint: {
    showLiveChatItemEndpoint: {
      renderer: {}
    }
  }
  detailText: Text
};

export function getMessageId(data: LiveChatTickerSponsorItemRenderer) {
  return data.id;
}

export function getAuthorChannelId(data: LiveChatTickerSponsorItemRenderer) {
  return data.authorExternalChannelId;
}

export function getAmountOfMembershipGifted(data: LiveChatTickerSponsorItemRenderer) {
  return +getOriginalText(data.detailText);
}
