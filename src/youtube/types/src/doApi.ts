import {
  request as undiciFetch,
} from 'undici';

export async function request(
  innertubeApiKey: string,
  options: {
    continuation?: string,
    browseId?: string,
    params?: string,
  },
) {
  return await undiciFetch(`https://www.youtube.com/youtubei/v1/browse?key=${innertubeApiKey}&prettyPrint=false`, {
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
  }).then(res => res.body.json() as any);
}
