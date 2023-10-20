import { Image } from "../generic/image"
import { NavigationEndpoint } from "../generic/navigationEndpoint"
import { SubscriberCountText } from "../generic/subscriberCountText"
import { Text } from "../generic/text"

export type VideoOwnerRenderer = {
  thumbnail: Image
  /**
   * `HAACHAMA Ch 赤井はあと`
   */
  title: Text
  navigationEndpoint: NavigationEndpoint
  subscriberCountText: SubscriberCountText
  membershipButton?: {}
}
