import { Image } from "../generic/image";
import { Runs } from "../generic/runs";

export type LiveChatTextMessageRenderer = {
  id: string
  timestampUsec: string
  authorExternalChannelId: string
  message: {
    runs: Runs
  }
  authorName: {
    simpleText: string
  }
  authorPhoto: Image
};

export function getMessageId(data: LiveChatTextMessageRenderer) {
  return data.id;
}

export function getMessageTimestamp(data: LiveChatTextMessageRenderer) {
  return data.timestampUsec;
}
