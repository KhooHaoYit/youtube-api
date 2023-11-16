import { Image } from "../generic/image"
import { Text } from "../generic/text"

export type ChannelOwnerEmptyStateRenderer = {
  illustration: Image
  /**
   * `This channel doesn't have any content`
   */
  description: Text
}
