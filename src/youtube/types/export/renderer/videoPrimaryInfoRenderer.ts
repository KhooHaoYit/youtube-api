import { Text } from "../generic/text";
import { MenuNavigationItemRenderer } from "./menuNavigationItemRenderer";
import { VideoViewCountRenderer } from "./videoViewCountRenderer";

export type VideoPrimaryInfoRenderer = {
  /**
   * Delicious Yummy Tasty GYOZA!!!
   */
  title: Text
  viewCount?: {
    videoViewCountRenderer: VideoViewCountRenderer
  }
  videoActions: {
    menuRenderer: {
      items: {
        menuNavigationItemRenderer: MenuNavigationItemRenderer
      }[]
    }
  },
  /**
   * Dec 15, 2022
   */
  dateText: Text
};


