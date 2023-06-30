
import { LiveChatMembershipItemRenderer } from '../renderer/liveChatMembershipItemRenderer';
import { LiveChatSponsorshipsGiftPurchaseAnnouncementRenderer } from '../renderer/liveChatSponsorshipsGiftPurchaseAnnouncementRenderer';
import * as liveChatSponsorshipsGiftPurchaseAnnouncementRenderer from '../renderer/liveChatSponsorshipsGiftPurchaseAnnouncementRenderer';
import { LiveChatTextMessageRenderer } from '../renderer/liveChatTextMessageRenderer';
import * as liveChatTextMessageRenderer from '../renderer/liveChatTextMessageRenderer';
import { LiveChatTickerSponsorItemRenderer } from '../renderer/liveChatTickerSponsorItemRenderer';
import * as liveChatTickerSponsorItemRenderer from '../renderer/liveChatTickerSponsorItemRenderer';
import { LiveChatViewerEngagementMessageRenderer } from '../renderer/liveChatViewerEngagementMessageRenderer';
import * as liveChatViewerEngagementMessageRenderer from '../renderer/liveChatViewerEngagementMessageRenderer';

export type LiveChatReplay = {
  innertubeApiKey: null,
  // null when liveChat not found
  ytInitialData: YtInitialData | null,
  ytInitialPlayerResponse: null,
};

export function get(data: LiveChatReplay) {
  if (!data.ytInitialData)
    throw new Error(`liveChat not found`);
  const chat = data.ytInitialData.continuationContents.liveChatContinuation.actions[0]
    .replayChatItemAction.actions[0];
  const offsetTimestamp = +data.ytInitialData.continuationContents.liveChatContinuation.actions[0]
    .replayChatItemAction.videoOffsetTimeMsec;
  let msg;
  if (msg = chat.addChatItemAction?.item.liveChatSponsorshipsGiftPurchaseAnnouncementRenderer)
    return {
      id: liveChatSponsorshipsGiftPurchaseAnnouncementRenderer.getMessageId(msg),
      offsetTimestamp,
    };
  if (msg = chat.addChatItemAction?.item.liveChatTextMessageRenderer)
    return {
      id: liveChatTextMessageRenderer.getMessageId(msg),
      offsetTimestamp,
    };
  if (msg = chat.addChatItemAction?.item.liveChatViewerEngagementMessageRenderer)
    return {
      id: liveChatViewerEngagementMessageRenderer.getMessageId(msg),
      offsetTimestamp,
    };
  if (msg = chat.addLiveChatTickerItemAction?.item.liveChatTickerSponsorItemRenderer)
    return {
      id: liveChatTickerSponsorItemRenderer.getMessageId(msg),
      offsetTimestamp,
    };
  throw new Error(`Unable to parse liveChat`);
}



type YtInitialData = {
  continuationContents: {
    liveChatContinuation: {
      actions: {
        replayChatItemAction: {
          videoOffsetTimeMsec: string
          actions: {
            addChatItemAction?: {
              item: {
                liveChatViewerEngagementMessageRenderer?: LiveChatViewerEngagementMessageRenderer
                liveChatSponsorshipsGiftPurchaseAnnouncementRenderer?: LiveChatSponsorshipsGiftPurchaseAnnouncementRenderer
                liveChatTextMessageRenderer?: LiveChatTextMessageRenderer
                liveChatMembershipItemRenderer?: LiveChatMembershipItemRenderer,
              }
            }
            addLiveChatTickerItemAction?: {
              item: {
                liveChatTickerSponsorItemRenderer: LiveChatTickerSponsorItemRenderer
              }
            }
          }[]
        }
      }[]
    }
  }
};
