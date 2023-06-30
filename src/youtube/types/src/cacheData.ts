import { mkdir, stat, writeFile } from "fs/promises";
import { YoutubeApi } from "../../api";
import { dirname } from "path";

const api = new YoutubeApi();

export async function generateCommunityPost(postId: string) {
  const path = `${__dirname}/../data/.tmp/posts/${postId}.ts`;
  if (
    await stat(path)
      .then(() => true)
      .catch(() => false)
  ) return;
  await mkdir(dirname(path), { recursive: true });

  const {
    ytInitialData,
    ytInitialPlayerResponse,
  } = await api.scrape(`/post/${postId}`);
  await writeFile(
    path,
    `
export type Data = ${JSON.stringify(ytInitialData, null, 2)};
export type PlayerResponse = ${JSON.stringify(ytInitialPlayerResponse, null, 2)};
`,
  );
  await writeFile(
    path.replace(/\.ts$/, '.json.ts'),
    `
export const Data = ${JSON.stringify(ytInitialData, null, 2)};
export const PlayerResponse = ${JSON.stringify(ytInitialPlayerResponse, null, 2)};
`,
  );
}

export async function generateChannelTab(channelId: string, tabName: string) {
  const path = `${__dirname}/../data/.tmp/channels/${channelId}/${tabName}.ts`;
  if (
    await stat(path)
      .then(() => true)
      .catch(() => false)
  ) return;
  await mkdir(dirname(path), { recursive: true });

  const {
    ytInitialData,
    ytInitialPlayerResponse,
  } = await api.scrape(`/channel/${channelId}/${tabName}`);
  await writeFile(
    path,
    `
export type Data = ${JSON.stringify(ytInitialData, null, 2)};
export type PlayerResponse = ${JSON.stringify(ytInitialPlayerResponse, null, 2)};
`,
  );
  await writeFile(
    path.replace(/\.ts$/, '.json.ts'),
    `
export const Data = ${JSON.stringify(ytInitialData, null, 2)};
export const PlayerResponse = ${JSON.stringify(ytInitialPlayerResponse, null, 2)};
`,
  );
}
