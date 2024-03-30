import { Image } from "../generic/image"
import { NavigationEndpoint } from "../generic/navigationEndpoint"
import { Text } from "../generic/text"

export type RichMetadataRowRenderer = {
  contents: {
    richMetadataRenderer: (
      | {
        style: 'RICH_METADATA_RENDERER_STYLE_BOX_ART'
        thumbnail: Image
        title: Text
        subtitle: Text
        endpoint: NavigationEndpoint
      }
      | {
        style: 'RICH_METADATA_RENDERER_STYLE_TOPIC'
        thumbnail: Image
        title: Text
      }
    )
  }[]
}
