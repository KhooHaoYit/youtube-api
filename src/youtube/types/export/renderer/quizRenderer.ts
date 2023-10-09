import { Text, getOriginalText } from "../generic/text";

export type QuizRenderer = {
  choices: {
    text: Text
    explanation: Text
    isCorrect: boolean
  }[]
};



export function getQuizInfo(
  data: QuizRenderer,
): [text: string, explaination: string, isCorrect: boolean][] {
  return data.choices.map(choice => [
    getOriginalText(choice.explanation),
    getOriginalText(choice.text),
    choice.isCorrect,
  ]);
}
