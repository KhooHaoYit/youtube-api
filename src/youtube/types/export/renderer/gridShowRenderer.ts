import { NavigationEndpoint } from "../generic/navigationEndpoint"
import { Text } from "../generic/text"

export type GridShowRenderer = {
  title: Text
  navigationEndpoint: NavigationEndpoint
  thumbnailOverlays: [{
    thumbnailOverlayBottomPanelRenderer: {
      // TODO: got , or not
      text: Text
    }
  }]
}
