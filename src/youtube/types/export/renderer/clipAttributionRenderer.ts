import { Image, getUrl } from "../generic/image"
import { Text, getOriginalText } from "../generic/text"

export type ClipAttributionRenderer = {
  authorAvatar: Image
  clipAuthor: Text
  title: Text
}

export function getClipInfo(data: ClipAttributionRenderer) {
  return {
    content: getOriginalText(data.title),
    authorUsername: getOriginalText(data.clipAuthor),
    authorAvatar: getUrl(data.authorAvatar),
  };
}
