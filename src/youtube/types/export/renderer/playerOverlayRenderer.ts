import { MultiMarkersPlayerBarRenderer } from "./multiMarkersPlayerBarRenderer"
import { PlayerOverlayVideoDetailsRenderer } from "./playerOverlayVideoDetailsRenderer"
import { WatchNextEndScreenRenderer } from "./watchNextEndScreenRenderer"

export type PlayerOverlayRenderer = {
  [key: string]: unknown
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
  videoDetails?: {
    playerOverlayVideoDetailsRenderer: PlayerOverlayVideoDetailsRenderer
  }
}
