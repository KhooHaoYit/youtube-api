import { Runs } from "../generic/runs";
import * as runs from "../generic/runs";

export type QuizRenderer = {
  choices: {
    text: { runs: Runs }
    explanation: { runs: Runs }
    isCorrect: boolean
  }[]
};



export function getQuizInfo(
  data: QuizRenderer,
): [text: string, explaination: string, isCorrect: boolean][] {
  return data.choices.map(choice => [
    runs.getOriginalText(choice.explanation.runs),
    runs.getOriginalText(choice.text.runs),
    choice.isCorrect,
  ]);
}
