import { Text, getOriginalText } from "../generic/text";

export type MessageRenderer = {
  text: Text
}

export function getMessageInfo(data: MessageRenderer) {
  return {
    content: getOriginalText(data.text),
  };
}
