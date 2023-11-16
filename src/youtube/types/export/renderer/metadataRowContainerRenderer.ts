import { MetadataRowRenderer } from "./metadataRowRenderer"
import { RichMetadataRowRenderer } from "./richMetadataRowRenderer"

export type MetadataRowContainerRenderer = {
  rows?: (
    | { metadataRowRenderer: MetadataRowRenderer }
    | { richMetadataRowRenderer: RichMetadataRowRenderer }
  )[]
  collapsedItemCount: number
}


