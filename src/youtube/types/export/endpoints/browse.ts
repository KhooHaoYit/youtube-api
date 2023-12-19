import { request } from "undici"
import { SectionListRenderer } from "../renderer/sectionListRenderer";
import { PlaylistItemSection } from "../generic/playlistItemSection";
import { GridRenderer } from "../renderer/gridRenderer";
import { ContinuationItemRenderer } from "../renderer/continuationItemRenderer";
import { GridChannelRenderer } from "../renderer/gridChannelRenderer";
import { Channel } from "../url/channel";

export async function browsePlaylist(
  playlistId: string,
  options?: {
    headers?: Record<string, string>
  },
) {
  if (!playlistId)
    throw new Error(`playlistId not defined`);
  return await request(`https://www.youtube.com/youtubei/v1/browse`, {
    method: 'POST',
    headers: {
      ...options?.headers,
      'accept-language': 'en',
      'origin': 'https://www.youtube.com',
    },
    body: JSON.stringify({
      browseId: `VL${playlistId}`,
      params: `wgYCCAA`, // wgYCCAE hide unavailable videos
      context: {
        client: {
          clientName: "WEB",
          clientVersion: "2.20230831.09.00",
        },
      },
    }),
  }).then(res => <Promise<BrowsePlaylist>>res.body.json());
}

export type BrowsePlaylist = {
  contents: {
    twoColumnBrowseResultsRenderer: {
      tabs: {
        tabRenderer: {
          content: {
            sectionListRenderer: SectionListRenderer<{
              content: {
                itemSectionRenderer: PlaylistItemSection
              }
            }>
          }
        }
      }[]
    }
  }
}

export async function browseChannelSubs(
  channelId: string,
  options?: {
    headers?: Record<string, string>
  },
) {
  if (!channelId)
    throw new Error(`channelId not defined`);
  return await request(`https://www.youtube.com/youtubei/v1/browse`, {
    method: 'POST',
    headers: {
      ...options?.headers,
      'accept-language': 'en',
      'origin': 'https://www.youtube.com',
    },
    body: JSON.stringify({
      context: {
        client: {
          clientName: "WEB",
          clientVersion: "2.20230831.09.00",
        },
      }, // assuming channelId is 24 characters
      continuation: Buffer.from(`â©\x85²\x02/\x12\x18${channelId}\x1A\x138gYLGgmyAQYKAhIAGgA`, 'binary')
        .toString('base64url'),
    }),
  }).then(res => <Promise<BrowseChannelSubs>>res.body.json());
}

export type BrowseChannelSubs = {
  onResponseReceivedEndpoints: [{
    appendContinuationItemsAction: {
      continuationItems: [{
        gridRenderer: GridRenderer<{
          gridChannelRenderer?: GridChannelRenderer
          continuationItemRenderer?: ContinuationItemRenderer
        }>
      }]
    }
  }]
}

export async function browseChannelPlaylists(
  channelId: string,
  options?: {
    headers?: Record<string, string>
  },
) {
  if (!channelId)
    throw new Error(`channelId not defined`);
  return await request(`https://www.youtube.com/youtubei/v1/browse`, {
    method: 'POST',
    headers: {
      ...options?.headers,
      'accept-language': 'en',
      'origin': 'https://www.youtube.com',
    },
    body: JSON.stringify({
      browseId: channelId,
      params: `EglwbGF5bGlzdHPyBgQKAkIA`,
      context: {
        client: {
          clientName: "WEB",
          clientVersion: "2.20230831.09.00",
        },
      },
    }),
  }).then(res => <Promise<Exclude<Channel['ytInitialData'], null>>>res.body.json());
}

export async function browse(
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
          clientVersion: "2.20230831.09.00",
        },
      },
    }),
  }).then(res => res.body.json() as any);
}

export async function* browseAll<TList extends Record<string, any>[]>(
  innertubeApiKey: string,
  list?: TList,
): AsyncGenerator<TList[0], void, void> {
  for (; ;) {
    let continuationToken = '';
    for (const item of list ?? []) {
      if ('continuationItemRenderer' in item) {
        continuationToken = item.continuationItemRenderer.continuationEndpoint.continuationCommand.token;
        continue;
      }
      yield item;
      continue;
    }
    if (!continuationToken)
      break;
    list = await browse(innertubeApiKey, { continuation: continuationToken })
      .then(res => {
        if ('onResponseReceivedActions' in res)
          return res.onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems ?? [];
        if ('onResponseReceivedEndpoints' in res)
          return res.onResponseReceivedEndpoints[0].appendContinuationItemsAction.continuationItems ?? [];
        throw new Error(`Unable to extract continuation result`);
      });
  }
}
