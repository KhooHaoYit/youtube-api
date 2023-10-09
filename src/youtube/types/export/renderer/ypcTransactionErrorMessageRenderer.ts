import { Text, getOriginalText } from "../generic/text";

export type YpcTransactionErrorMessageRenderer = {
  errorMessages: [Text]
}

export function getErrorMessage(data: YpcTransactionErrorMessageRenderer) {
  return getOriginalText(data.errorMessages[0]);
}
