import { MultiMarkersPlayerBarRenderer } from "./multiMarkersPlayerBarRenderer"
import { PlayerOverlayVideoDetailsRenderer } from "./playerOverlayVideoDetailsRenderer"
import { WatchNextEndScreenRenderer } from "./watchNextEndScreenRenderer"

export type PlayerOverlayRenderer = {
  decoratedPlayerBarRenderer?: {
    decoratedPlayerBarRenderer: {
      playerBar: {
        multiMarkersPlayerBarRenderer: MultiMarkersPlayerBarRenderer
      }
    }
  }
  endScreen?: {
    watchNextEndScreenRenderer: WatchNextEndScreenRenderer
  }
  videoDetails: {
    playerOverlayVideoDetailsRenderer: PlayerOverlayVideoDetailsRenderer
  }
}
