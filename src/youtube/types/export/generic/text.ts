import { Runs } from "./runs"
import * as runs from "./runs"

export type Text =
  | { simpleText: string }
  | { runs: Runs }
  | {}

export function getOriginalText(data: Text) {
  if ('simpleText' in data)
    return data.simpleText;
  if ('runs' in data)
    return runs.getOriginalText(data.runs);
  return '';
}
