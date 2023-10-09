import { ChapterRenderer } from "./chapterRenderer"
import { HeatmapRenderer } from "./heatmapRenderer"

export type MultiMarkersPlayerBarRenderer = {
  markersMap?: (
    | {
      key: 'HEATSEEKER'
      value: {
        heatmap: {
          heatmapRenderer: HeatmapRenderer
        }
      }
    }
    | {
      key: 'AUTO_CHAPTERS' | 'DESCRIPTION_CHAPTERS'
      value: {
        chapters: {
          chapterRenderer: ChapterRenderer
        }[]
      }
    }
  )[]
  [key: string]: unknown
}
