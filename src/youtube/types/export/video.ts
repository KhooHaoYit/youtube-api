import { PlayerMicroformatRenderer } from './playerMicroformatRenderer';

export type VideoPlayerResponse = {
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
      playerLegacyDesktopYpcOfferRenderer?: {
        offerId: "sponsors_only_video",
      },
      playerErrorMessageRenderer?: {
        subreason?: {
          simpleText?: string,
          runs?: [{ text: string }],
        },
        reason: {
          simpleText: string,
        },
      },
    },
  },
  /**
   * not defined if video is unable to watch
   */
  microformat?: {
    playerMicroformatRenderer: PlayerMicroformatRenderer,
  },
};

import { CompactRadioRenderer } from './compactRadioRenderer';
import { CompactVideoRenderer } from './compactVideoRenderer';
import { ContinuationItemRenderer } from './continuationItemRenderer';
import { EndScreenPlaylistRenderer } from './endScreenPlaylistRenderer';
import { EndScreenVideoRenderer } from './endScreenVideoRenderer';

export type Video = {
  // "contents": {
  //   "twoColumnWatchNextResults": {
  //     "secondaryResults": {
  //       "secondaryResults": {
  //         "results": (
  //           { compactVideoRenderer: CompactVideoRenderer }
  //           | { compactRadioRenderer: CompactRadioRenderer }
  //           | { continuationItemRenderer: ContinuationItemRenderer }
  //         )[],
  //       }
  //     },
  //   }
  // },
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
