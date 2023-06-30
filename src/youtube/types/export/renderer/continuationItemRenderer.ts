import { request } from "../../src/doApi";

export type ContinuationItemRenderer = {
  continuationEndpoint: {
    continuationCommand: {
      token: string,
    },
  },
};

export async function loadMore(data: ContinuationItemRenderer, innertubeApiKey: string) {
  return await request(innertubeApiKey, {
    continuation: data.continuationEndpoint.continuationCommand.token,
  });
}
