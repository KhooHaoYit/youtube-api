import { Runs } from "./runs";
import * as runs from "./runs";
import { StringOfDigitsAndComma } from "./stringOfDigitsAndComma";

/**
 * `814,941,335 views`
 * `2 watching`
 * 
 * might be different when video is live??
 */
export type ViewCountText = {
  runs?: Runs
  simpleText?: `${StringOfDigitsAndComma} views`,
};

export function getViewCount(data: ViewCountText) {
  const text = data.runs
    ? runs.getOriginalText(data.runs)
    : data.simpleText;
  if (!text)
    throw new Error(`Unable to parse view count`);
  return +text
    .replace(/ [^]+/, '')
    .replace(/,/g, '');
}
