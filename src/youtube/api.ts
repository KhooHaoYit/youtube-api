import { Injectable } from '@nestjs/common';
import { request } from 'undici';
import { Channel } from './types/export/channel';
import { VideoPlayerResponse } from './types/export/video';

@Injectable()
export class YoutubeApi {

  constructor() { }

  async scrapeYoutubePage(
    url: string,
    options?: {
      headers?: {
        cookie?: string,
        authorization?: string,
      },
    },
  ): Promise<{
    innertubeApiKey: string,
    ytInitialData: Channel,
    ytInitialPlayerResponse: VideoPlayerResponse | null,
  }> {
    const html = await request(url, {
      headers: {
        'accept-language': 'en',
        ...options?.headers,
      },
    }).then(res => res.body.text());
    const innertubeApiKey = html.match(/(?<=innertubeApiKey":").+?(?=","innertubeApiVersion)/)?.at(0);
    if (!innertubeApiKey)
      throw new Error(`Unable to extract innertubeApiKey`);
    const ytInitialData = <Channel>JSON.parse(html.match(/(?<=ytInitialData = ).+?(?=;<\/script>)/)?.at(0) || '');
    const ytInitialPlayerResponse = <VideoPlayerResponse | null>JSON.parse(
      html.match(/(?<=ytInitialPlayerResponse = ).+?(?=;(?:<\/script>|var [^ ]+ = ))/)?.at(0)
      || 'null'
    );
    return {
      innertubeApiKey,
      ytInitialData,
      ytInitialPlayerResponse,
    };
  }

  async request(
    innertubeApiKey: string,
    options: {
      continuation?: string,
      browseId?: string,
      params?: string,
    },
  ) {
    return await request(`https://www.youtube.com/youtubei/v1/browse?key=${innertubeApiKey}&prettyPrint=false`, {
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
            clientVersion: "2.20220314.01.00",
          },
        },
      }),
    }).then(res => res.body.json());
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
      list = await this.request(innertubeApiKey, { continuation: continuationToken })
        .then(res => {
          if ('onResponseReceivedActions' in res)
            return res.onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems;
          if ('onResponseReceivedEndpoints' in res)
            return res.onResponseReceivedEndpoints[0].appendContinuationItemsAction.continuationItems;
          throw new Error(`Unable to extract continuation result`);
        });
    }
  }

}
