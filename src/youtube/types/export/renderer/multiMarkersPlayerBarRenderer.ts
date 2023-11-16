import { ChapterRenderer } from "./chapterRenderer"
import { HeatmapRenderer } from "./heatmapRenderer"
import { MarkerRenderer } from "./markerRenderer"

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
    | {
      key: 'ANIMATION_ANNOTATION_MARKERS'
      value: {
        markers: {
          markerRenderer: MarkerRenderer
        }[]
      }
    }
  )[]
  [key: string]: unknown
}
