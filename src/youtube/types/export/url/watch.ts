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
import { PlaylistPanelVideoRenderer } from '../renderer/playlistPanelVideoRenderer';
import { Runs } from '../generic/runs';
import * as runs from '../generic/runs';
import { PlayerOverlayRenderer } from '../renderer/playerOverlayRenderer';
import { MessageRenderer } from '../renderer/messageRenderer';
import { BackgroundPromoRenderer } from '../renderer/backgroundPromoRenderer';
import { CommentsEntryPointHeaderRenderer } from '../renderer/commentsEntryPointHeaderRenderer';
import { ClipSectionRenderer } from '../renderer/clipSectionRenderer';

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

export function getPlaylistExtraChannelIds(data: YtInitialData) {
  const textRuns = data.contents.twoColumnWatchNextResults
    .playlist?.playlist.longBylineText.runs;
  if (!textRuns)
    return;
  return textRuns
    .map(run => {
      const browseId = runs.getBrowseId([run]);
      if (!browseId)
        return;
      return [runs.getOriginalText([run]), browseId];
    })
    .filter(browseId => browseId);
}

const membershipLevelRegex = /^This video is available to this channel's members on level: ([^]+?) \(or any higher level\)\. Join this channel to get access to members-only content and other exclusive perks\.$/;
const minimumMembershipLevelRegex = /^Join this channel to get access to members-only content like this video, and other exclusive perks\.$/;
export function getRequiredMembershipLevel(data: Watch) {
  const error = getErrorMessage(data);
  if (!error)
    return;
  if (minimumMembershipLevelRegex.test(error))
    return true;
  if (membershipLevelRegex.test(error))
    return error.match(membershipLevelRegex)![1];
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
              /**
               * `Comments are turned off`
               */
              messageRenderer?: MessageRenderer
              commentsEntryPointHeaderRenderer?: CommentsEntryPointHeaderRenderer
              backgroundPromoRenderer?: BackgroundPromoRenderer
              continuationItemRenderer?: ContinuationItemRenderer
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
      playlist?: {
        playlist: {
          longBylineText: {
            simpleText?: string
            runs?: Runs
          }
          contents: {
            playlistPanelVideoRenderer: PlaylistPanelVideoRenderer
          }[]
        }
      }
    }
  },
  frameworkUpdates?: {
    entityBatchUpdate: {
      mutations: (
        | {
          type: 'ENTITY_MUTATION_TYPE_REPLACE'
          payload: {
            likeStatusEntity?: {}
            playlistLoopStateEntity?: {}
            macroMarkersListEntity?: {
              markersList: (
                | {
                  markerType: 'MARKER_TYPE_HEATMAP'
                  markers: {
                    startMillis: string
                    durationMillis: string
                    intensityScoreNormalized: number
                  }[]
                }
                | {
                  markerType: 'MARKER_TYPE_TIMESTAMPS'
                }
              )
            }
            subscriptionStateEntity?: {}
          }
        }
        | {
          type: 'ENTITY_MUTATION_TYPE_DELETE'
          options: {}
        }
      )[]
    }
  }
  playerOverlays?: {
    playerOverlayRenderer: PlayerOverlayRenderer
  }
  engagementPanels: {
    engagementPanelSectionListRenderer: (
      | {
        targetId: 'engagement-panel-ads'
      }
      | {
        targetId: 'engagement-panel-macro-markers-auto-chapters'
      }
      | {
        targetId: 'engagement-panel-clip-view'
        content: {
          clipSectionRenderer: ClipSectionRenderer
        }
      }
      | {
        targetId: 'engagement-panel-structured-description'
      }
      | {
        targetId: 'engagement-panel-comments-section'
      }
      | {
        targetId: 'engagement-panel-searchable-transcript'
      }
      | {
        targetId: 'engagement-panel-macro-markers-description-chapters'
      }
      | {
        targetId: 'engagement-panel-transcript'
      }
    )
  }[]
};
