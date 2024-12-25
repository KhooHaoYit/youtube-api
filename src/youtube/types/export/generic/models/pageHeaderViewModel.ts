import { Text } from "../text"

export type PageHeaderViewModel = {
  metadata: {
    contentMetadataViewModel: {
      metadataRows: {
        metadataParts: {
          avatarStack?: {}
          text?: Text
        }[]
      }[]
    }
  }
  banner?: {
    imageBannerViewModel: {
      image: {
        sources: {
          url: string
        }[]
      }
    }
  }
}