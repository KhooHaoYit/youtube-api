import { Text, getOriginalText } from "../generic/text";

export type PlayerErrorMessageRenderer = {
  subreason?: Text,
  /**
   * simple error message, more details would be provided on subreason
   */
  reason: Text,
};

export function getErrorMessage(data: PlayerErrorMessageRenderer) {
  if (data.subreason)
    return getOriginalText(data.subreason);
  return getOriginalText(data.reason);
}
