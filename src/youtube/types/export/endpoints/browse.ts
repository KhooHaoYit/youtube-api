import { request } from "undici"
import { SectionListRenderer } from "../renderer/sectionListRenderer";
import { PlaylistItemSection } from "../generic/playlistItemSection";

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
      context: {
        client: {
          clientName: "WEB",
          clientVersion: "2.20230831.09.00",
        },
      },
      params: `wgYCCAA`, // wgYCCAE hide unavailable videos
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
