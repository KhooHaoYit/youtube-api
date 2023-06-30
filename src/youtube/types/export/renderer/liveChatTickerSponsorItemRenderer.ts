export type LiveChatTickerSponsorItemRenderer = {
  id: string,
  authorExternalChannelId: string
  durationSec: number
  showItemEndpoint: {
    showLiveChatItemEndpoint: {
      renderer: {}
    }
  }
  detailText: {
    simpleText: string
  }
};

export function getMessageId(data: LiveChatTickerSponsorItemRenderer) {
  return data.id;
}

export function getAuthorChannelId(data: LiveChatTickerSponsorItemRenderer) {
  return data.authorExternalChannelId;
}

export function getAmountOfMembershipGifted(data: LiveChatTickerSponsorItemRenderer) {
  return +data.detailText.simpleText;
}
