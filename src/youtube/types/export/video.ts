import { PlayerMicroformatRenderer } from './renderer/playerMicroformatRenderer';

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

export function getErrorMessage(data: VideoPlayerResponse) {
  let output: undefined | string;
  if (output = data.playabilityStatus.messages?.[0])
    return output;
  if (output = data.playabilityStatus.errorScreen?.playerErrorMessageRenderer?.subreason?.simpleText)
    return output;
  if (output = data.playabilityStatus.errorScreen?.playerErrorMessageRenderer?.subreason?.runs?.map(run => run.text).join(''))
    return output;
  return data.playabilityStatus.reason;
}

import { CompactRadioRenderer } from './renderer/compactRadioRenderer';
import { CompactVideoRenderer } from './renderer/compactVideoRenderer';
import { ContinuationItemRenderer } from './renderer/continuationItemRenderer';
import { EndScreenPlaylistRenderer } from './renderer/endScreenPlaylistRenderer';
import { EndScreenVideoRenderer } from './renderer/endScreenVideoRenderer';

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
