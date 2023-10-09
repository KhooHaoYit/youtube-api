import { Image } from "../generic/image"

export type ChannelThumbnailWithLinkRenderer = {
  thumbnail: Image
  navigationEndpoint: {
    browseEndpoint: {
      /**
       * `UCAPdxmEjYxUdQMf_JaQRl1Q`
       */
      browseId: string
      /**
       * `/@manae_nme`
       */
      canonicalBaseUrl?: string
    }
  }
}
