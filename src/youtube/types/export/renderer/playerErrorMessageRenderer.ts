import { Runs } from "../generic/runs";
import * as runs from "../generic/runs";

export type PlayerErrorMessageRenderer = {
  subreason?: {
    simpleText?: string,
    runs?: Runs,
  },
  /**
   * simple error message, more details would be provided on subreason
   */
  reason: {
    simpleText?: string,
    runs?: Runs,
  },
};

export function getErrorMessage(data: PlayerErrorMessageRenderer) {
  if (data.subreason?.simpleText)
    return data.subreason.simpleText;
  if (data.subreason?.runs)
    return runs.getOriginalText(data.subreason.runs);
  if (data.reason.simpleText)
    return data.reason.simpleText;
  return runs.getOriginalText(data.reason.runs!);
}
