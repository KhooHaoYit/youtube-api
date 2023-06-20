import { StringOfDigitsAndDotWithNotation, getNumber } from "./stringOfDigitsAndDotWithNotation";

/**
 * `778K subscribers`
 * 
 * `1.42M subscribers`
 */
export type SubscriberCountText = {
  simpleText: `${StringOfDigitsAndDotWithNotation} subscribers`
};

export function getSubscriberCount(data: SubscriberCountText) {
  return getNumber(
    <StringOfDigitsAndDotWithNotation>
    data.simpleText.replace(/ [^]*/, '')
  );
}
