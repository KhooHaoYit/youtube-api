import { SubscriberCountText } from "../generic/subscriberCountText";
import { MetadataRowContainerRenderer } from "./metadataRowContainerRenderer";
import { VideoOwnerRenderer } from "./videoOwnerRenderer";

export type VideoSecondaryInfoRenderer = {
  owner: {
    videoOwnerRenderer: VideoOwnerRenderer
  },
  /**
   * not defined on age restricted video (??)
   */
  attributedDescription?: {
    /**
     * description (need to find ways to fix link back - KpCH4mbj_pk twitter link cut off)
     */
    content: string,
    commandRuns?: {
      startIndex: number,
      length: number,
      onTap: {
        innertubeCommand: {
          commandMetadata: {
            webCommandMetadata: {
              /**
               * `/playlist?list=PLQoA24ikdy_n3hEVbX5PkDrZVV7XAbbrz`
               * `https://www.youtube.com/redirect?...`
               */
              url: string,
            }
          },
        }
      }
    }[],
  }
  metadataRowContainer: {
    metadataRowContainerRenderer: MetadataRowContainerRenderer
  }
};


