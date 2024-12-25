import { OneOfKeyWithEmpty } from "src/common/typeUtils"
import { Runs } from "./runs"
import * as runs from "./runs"

export type Text = OneOfKeyWithEmpty<{
  simpleText: string
  content: string
  runs: Runs
}>

export function getOriginalText(data: Text) {
  if (data.simpleText)
    return data.simpleText;
  if (data.runs)
    return runs.getOriginalText(data.runs);
  if (data.content)
    return data.content;
  return '';
}
