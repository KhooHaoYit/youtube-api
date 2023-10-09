import { Image } from "../generic/image";
import { Runs } from "../generic/runs";
import { Text } from "../generic/text";

export type LiveChatTextMessageRenderer = {
  id: string
  timestampUsec: string
  authorExternalChannelId: string
  message: Text
  authorName: Text
  authorPhoto: Image
};

export function getMessageId(data: LiveChatTextMessageRenderer) {
  return data.id;
}

export function getMessageTimestamp(data: LiveChatTextMessageRenderer) {
  return data.timestampUsec;
}
