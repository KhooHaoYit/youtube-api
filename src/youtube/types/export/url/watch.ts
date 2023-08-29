import { PlayerMicroformatRenderer } from '../renderer/playerMicroformatRenderer';
import { PlayerErrorMessageRenderer } from '../renderer/playerErrorMessageRenderer';
import * as playerErrorMessageRenderer from '../renderer/playerErrorMessageRenderer';
import { PlayerLegacyDesktopYpcOfferRenderer } from '../renderer/playerLegacyDesktopYpcOfferRenderer';
import { CompactVideoRenderer } from '../renderer/compactVideoRenderer';
import { ContinuationItemRenderer } from '../renderer/continuationItemRenderer';
import { CompactPlaylistRenderer } from '../renderer/compactPlaylistRenderer';
import { RelatedChipCloudRenderer } from '../renderer/relatedChipCloudRenderer';
import { ItemSectionRenderer } from '../renderer/itemSectionRenderer';
import { VideoPrimaryInfoRenderer } from '../renderer/videoPrimaryInfoRenderer';
import { VideoSecondaryInfoRenderer } from '../renderer/videoSecondaryInfoRenderer';
import { LiveChatRenderer } from '../renderer/liveChatRenderer';
import { ConversationBarRenderer } from '../renderer/conversationBarRenderer';
import { CompactRadioRenderer } from '../renderer/compactRadioRenderer';

export type Watch = {
  innertubeApiKey: string,
  ytInitialData: YtInitialData,
  ytInitialPlayerResponse: YtInitialPlayerResponse
}

export function getErrorMessage(data: Watch) {
  const error = data.ytInitialPlayerResponse.playabilityStatus.errorScreen?.playerErrorMessageRenderer;
  if (error)
    return playerErrorMessageRenderer.getErrorMessage(error);
  return;
}



type YtInitialPlayerResponse = {
  playabilityStatus: {
    status: string,
    messages?: [string],
    reason?: string,
    /**
     * not defined when it's playable in guest
     */
    errorScreen?: {
      /**
       * defined when video is membership only while not having membership
       */
      playerLegacyDesktopYpcOfferRenderer?: PlayerLegacyDesktopYpcOfferRenderer,
      playerErrorMessageRenderer?: PlayerErrorMessageRenderer,
    },
  },
  /**
   * not defined if video is unable to watch
   */
  microformat?: {
    playerMicroformatRenderer: PlayerMicroformatRenderer,
  },
};

type YtInitialData = {
  contents: {
    twoColumnWatchNextResults: {
      results: {
        results: {
          contents?: {
            videoPrimaryInfoRenderer?: VideoPrimaryInfoRenderer
            videoSecondaryInfoRenderer?: VideoSecondaryInfoRenderer
            itemSectionRenderer?: ItemSectionRenderer<{
              messageRenderer?: {}
              commentsEntryPointHeaderRenderer?: {}
              backgroundPromoRenderer?: {}
              continuationItemRenderer?: {}
            }>
          }[]
          [key: string]: unknown
        }
      }
      secondaryResults?: {
        secondaryResults: {
          results: {
            compactPlaylistRenderer?: CompactPlaylistRenderer
            compactVideoRenderer?: CompactVideoRenderer
            compactRadioRenderer?: CompactRadioRenderer
            relatedChipCloudRenderer?: RelatedChipCloudRenderer
            itemSectionRenderer?: ItemSectionRenderer<{}>
            continuationItemRenderer?: ContinuationItemRenderer
          }[],
        }
      },
      conversationBar?: {
        /**
         * defined when live chat was turned off/not available
         */
        conversationBarRenderer?: ConversationBarRenderer
        liveChatRenderer?: LiveChatRenderer
      }
    }
  },
  // "playerOverlays": {
  //   "playerOverlayRenderer": {
  //     "endScreen": {
  //       "watchNextEndScreenRenderer": {
  //         "results": (
  //           { endScreenVideoRenderer: EndScreenVideoRenderer }
  //           | { endScreenPlaylistRenderer: EndScreenPlaylistRenderer }
  //         )[],
  //       }
  //     },
  //     /**
  //      * replay frequency graph can be found here
  //      */
  //     "decoratedPlayerBarRenderer": {}
  //   }
  // },
};
