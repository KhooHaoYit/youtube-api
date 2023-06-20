import { Runs } from "../generic/runs";

export type VideoPrimaryInfoRenderer = {
  title: {
    /**
     * Delicious Yummy Tasty GYOZA!!!
     */
    runs: Runs,
  },
  viewCount: {
    videoViewCountRenderer: {
      viewCount: {
        /**
         * `61,712 views`
         */
        simpleText: string
      },
    }
  },
  videoActions: {
    menuRenderer: {
      topLevelButtons: {
        buttonRenderer?: {}
        segmentedLikeDislikeButtonRenderer?: {
          likeButton: {
            toggleButtonRenderer: {
              defaultText: {
                accessibility: {
                  accessibilityData: {
                    /**
                     * `5,139 likes`
                     */
                    label: string
                  }
                },
              },
            }
          }
        }
      }[],
    }
  },
  dateText: {
    /**
     * Dec 15, 2022
     */
    simpleText: string
  },
};


