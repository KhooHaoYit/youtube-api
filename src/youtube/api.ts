import { Injectable } from '@nestjs/common';
import { LiveChatReplay } from './types/export/url/liveChatReplay';
import { Watch } from './types/export/url/watch';
import { Channel } from './types/export/url/channel';
import { Post } from './types/export/url/post';
import { Playlist } from './types/export/url/playlist';

type ScrapeMap = [
  [
    `/watch?v=${string}`,
    Watch,
  ],
  [
    `/channel/${string}`,
    Channel,
  ],
  [
    `/live_chat_replay?continuation=${string}`,
    LiveChatReplay,
  ],
  [
    `/post/${string}`,
    Post,
  ],
  [
    `/playlist?list=${string}`,
    Playlist,
  ],
];

type GetKey<T extends ScrapeMap> = T extends ([infer T, any])[] ? T : never;
type GetValue<K extends string> = {
  [I in Exclude<keyof ScrapeMap, keyof []>]: K extends ScrapeMap[I][0] ? ScrapeMap[I][1] : never;
} extends infer T ?
  T[keyof T] extends never
  ? {
    innertubeApiKey: string | null,
    ytInitialData: Record<string, any> | null,
    ytInitialPlayerResponse: Record<string, any> | null,
  }
  : T[keyof T]
  : never;

@Injectable()
export class YoutubeApi {

  constructor() { }

  async scrape<K extends GetKey<ScrapeMap> | string>(
    href: K,
    options?: {
      headers?: {
        cookie?: string,
        authorization?: string,
      },
    },
  ): Promise<GetValue<K>>;
  async scrape(
    href: string,
    options?: {
      headers?: {
        cookie?: string,
        authorization?: string,
      },
    },
  ) {
    const html = await fetch(`https://www.youtube.com${href}`, {
      headers: {
        'accept-language': 'en',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        ...options?.headers,
      },
    }).then(res => res.text());
    const innertubeApiKey = html.match(/(?<=innertubeApiKey":").+?(?=","innertubeApiVersion)/)?.at(0)
      ?? null;
    const ytInitialData = <Record<string, any> | null>JSON.parse(
      html.match(/(?<=ytInitialData = ).+?(?=;<\/script>)/)?.at(0)
      // https://www.youtube.com/live_chat_replay?continuation=CONTINUATION_ID
      || html.match(/(?<=window\["ytInitialData"] = ){.+?}(?=;<\/script>)/)?.at(0)
      || 'null'
    );
    const ytInitialPlayerResponse = <Record<string, any> | null>JSON.parse(
      html.match(/(?<=ytInitialPlayerResponse = ).+?(?=;(?:<\/script>|var [^ ]+ = ))/)?.at(0)
      || 'null'
    );
    return {
      innertubeApiKey,
      ytInitialData,
      ytInitialPlayerResponse,
    };
  }

  async browse(
    innertubeApiKey: string,
    options: {
      continuation?: string,
      browseId?: string,
      params?: string,
    },
  ) {
    return await fetch(`https://www.youtube.com/youtubei/v1/browse?key=${innertubeApiKey}&prettyPrint=false`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'accept-language': 'en',
        "x-origin": "https://www.youtube.com",
      },
      body: JSON.stringify({
        ...options,
        context: {
          client: {
            clientName: 'WEB',
            clientVersion: "2.20230831.09.00",
          },
        },
      }),
    }).then(res => res.json() as any);
  }

  async* requestAll<T extends Record<string, any>>(
    innertubeApiKey: string,
    list: T[],
  ) {
    for (; ;) {
      let continuationToken = '';
      for (const item of list) {
        if ('continuationItemRenderer' in item) {
          continuationToken = item.continuationItemRenderer.continuationEndpoint.continuationCommand.token;
          continue;
        }
        yield item as T extends { continuationItemRenderer: any } ? never : T;
        continue;
      }
      if (!continuationToken)
        break;
      list = await this.browse(innertubeApiKey, { continuation: continuationToken })
        .then(res => {
          if ('onResponseReceivedActions' in res)
            return res.onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems ?? [];
          if ('onResponseReceivedEndpoints' in res)
            return res.onResponseReceivedEndpoints[0].appendContinuationItemsAction.continuationItems ?? [];
          throw new Error(`Unable to extract continuation result`);
        });
    }
  }

}
