import { EndScreenPlaylistRenderer } from "./endScreenPlaylistRenderer"
import { EndScreenVideoRenderer } from "./endScreenVideoRenderer"

export type WatchNextEndScreenRenderer = {
  results: {
    endScreenPlaylistRenderer?: EndScreenPlaylistRenderer
    endScreenVideoRenderer?: EndScreenVideoRenderer
  }[]
}
