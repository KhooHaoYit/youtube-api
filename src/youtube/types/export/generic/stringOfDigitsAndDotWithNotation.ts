export type StringOfDigitsAndDotWithNotation = `${string}${'K' | 'M'}`;

export function getNumber(text: StringOfDigitsAndDotWithNotation) {
  switch (text[text.length - 1]) {
    default:
      throw new Error(`Unable to parse: ${text}`);
    case 'M':
      return Math.round(+text.replace('M', '') * 1_000_000);
    case 'K': // 4.06 * 100
      return Math.round(+text.replace('K', '') * 1_000);
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
      return +text;
  }
}
