import { PlaylistSidebarPrimaryInfoRenderer } from "./playlistSidebarPrimaryInfoRenderer"
import { PlaylistSidebarSecondaryInfoRenderer } from "./playlistSidebarSecondaryInfoRenderer"

export type PlaylistSidebarRenderer = {
  items: {
    playlistSidebarPrimaryInfoRenderer?: PlaylistSidebarPrimaryInfoRenderer
    playlistSidebarSecondaryInfoRenderer?: PlaylistSidebarSecondaryInfoRenderer
  }[]
}
