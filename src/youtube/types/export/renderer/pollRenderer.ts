import { getUrl, Image } from "../generic/image";
import { getOriginalText, Runs } from "../generic/runs";
import { StringOfDigitsAndDotWithNotation, getNumber } from "../generic/stringOfDigitsAndDotWithNotation";

export type PollRenderer = {
  choices: {
    text: {
      runs: Runs,
    }
    image?: Image
  }[]
  totalVotes: {
    simpleText: `${StringOfDigitsAndDotWithNotation} votes`,
  },
};

export function getPollInfo(data: PollRenderer) {
  const choices = data.choices
    .map(c => ({
      text: getOriginalText(c.text.runs),
      imageUrl: c.image && getUrl(c.image),
    }));
  const totalVotes = getNumber(
    <StringOfDigitsAndDotWithNotation>
    data.totalVotes.simpleText.replace(/ [^]*/, '')
  );
  return {
    choices,
    totalVotes,
  };
}
