import { Text } from "../generic/text";

export type LiveChatViewerEngagementMessageRenderer = {
  id: string
  timestampUsec: string
  message: Text
};

export function getMessageId(data: LiveChatViewerEngagementMessageRenderer) {
  return data.id;
}

export function getMessageTimestamp(data: LiveChatViewerEngagementMessageRenderer) {
  return data.timestampUsec;
}
