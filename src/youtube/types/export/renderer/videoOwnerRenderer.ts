import { Image } from "../generic/image"
import { SubscriberCountText } from "../generic/subscriberCountText"
import { Text } from "../generic/text"

export type VideoOwnerRenderer = {
  thumbnail: Image
  /**
   * `HAACHAMA Ch 赤井はあと`
   */
  title: Text
  navigationEndpoint: {
    browseEndpoint: {
      /**
       * `UC1CfXB_kRs3C-zaeTG3oGyg`
       */
      browseId: string
      /**
       * /@AkaiHaato
       */
      canonicalBaseUrl: string
    }
  }
  subscriberCountText: SubscriberCountText
  membershipButton?: {}
}
