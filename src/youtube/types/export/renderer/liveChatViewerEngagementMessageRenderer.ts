import { Runs } from "../generic/runs";

export type LiveChatViewerEngagementMessageRenderer = {
  id: string
  timestampUsec: string
  message: {
    runs: Runs
  }
};

export function getMessageId(data: LiveChatViewerEngagementMessageRenderer) {
  return data.id;
}

export function getMessageTimestamp(data: LiveChatViewerEngagementMessageRenderer) {
  return data.timestampUsec;
}
