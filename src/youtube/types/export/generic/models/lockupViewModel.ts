import { Text } from "../text"

export type LockupViewModel = {
  contentId: string
  metadata: {
    lockupMetadataViewModel: {
      title: Text
    }
  }
  contentImage: {
    collectionThumbnailViewModel: {
      primaryThumbnail: {
        thumbnailViewModel: {
          overlays: (
            {
              thumbnailHoverOverlayViewModel?: {}
              thumbnailOverlayBadgeViewModel?: {
                thumbnailBadges: [
                  {
                    thumbnailBadgeViewModel: {
                      /**
                       * `2 videos`
                       */
                      text: string
                    }
                  }
                ]
              }
            }
          )[]
        }
      }
    }
  }
}