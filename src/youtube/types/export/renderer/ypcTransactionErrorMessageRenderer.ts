import { Runs, getOriginalText } from "../generic/runs"

export type YpcTransactionErrorMessageRenderer = {
  errorMessages: [
    {
      runs: Runs
    }
  ]
}

export function getErrorMessage(data: YpcTransactionErrorMessageRenderer) {
  return getOriginalText(data.errorMessages[0].runs);
}
