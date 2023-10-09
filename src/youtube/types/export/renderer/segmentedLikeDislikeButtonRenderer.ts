export type SegmentedLikeDislikeButtonRenderer = {
  likeButton: {
    buttonRenderer?: {}
    toggleButtonRenderer?: {
      defaultText: {
        accessibility?: {
          accessibilityData: {
            /**
             * `5,139 likes`
             */
            label: string
          }
        },
        [key: string]: unknown
      },
    }
  }
}
