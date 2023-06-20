import { StringOfDigitsAndComma } from "./stringOfDigitsAndComma";

/**
 * `814,941,335 views`
 * 
 * might be different when video is live??
 */
export type ViewCountText = {
  "simpleText": `${StringOfDigitsAndComma} views`,
};

export function getViewCount(text: ViewCountText) {
  return +text.simpleText
    .replace(/ [^]+/, '')
    .replace(/,/g, '');
}


