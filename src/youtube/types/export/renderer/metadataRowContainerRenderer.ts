import { OneOfKeyWithEmpty } from "src/common/typeUtils"
import { MetadataRowRenderer } from "./metadataRowRenderer"
import { RichMetadataRowRenderer } from "./richMetadataRowRenderer"

export type MetadataRowContainerRenderer = {
  rows?: OneOfKeyWithEmpty<{
    metadataRowRenderer: MetadataRowRenderer
    richMetadataRowRenderer: RichMetadataRowRenderer
  }>[]
  collapsedItemCount: number
}


