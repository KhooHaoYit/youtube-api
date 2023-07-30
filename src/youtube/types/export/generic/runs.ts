import { Image } from "./image";
import * as image from "./image";

export type Runs = {
  text?: string,
  navigationEndpoint?: {
    urlEndpoint?: {
      url: string,
    },
    browseEndpoint?: {
      browseId: string,
    }
    [key: string]: unknown,
  },
  emoji?: {
    emojiId: `${ChannelId}/${EmojiId}`
    image: Image
  }
}[];

type ChannelId = string;
type EmojiId = string;

export function getOriginalText(runs: Runs) {
  return runs.map(run => {
    const url = run.navigationEndpoint?.urlEndpoint?.url;
    if (url) {
      const urlObj = new URL(url);
      return urlObj.origin === 'https://www.youtube.com' && urlObj.pathname === '/redirect'
        ? urlObj.searchParams.get('q')
        : url;
    }
    if (typeof run.text === 'string')
      return run.text;
    if (run.emoji) {
      const imageData = {
        emojiId: run.emoji.emojiId,
        name: image.getName(run.emoji.image),
        url: image.getUrl(run.emoji.image),
      };
      return `\0${JSON.stringify(imageData)}\0`;
    }
    throw new Error(`Unable to get original text`);
  }).join('');
}

export function getBrowseId(runs: Runs) {
  const browseId = runs[0].navigationEndpoint?.browseEndpoint?.browseId;
  if (!browseId)
    throw new Error(`browseId is not defined`);
  return browseId;
}
