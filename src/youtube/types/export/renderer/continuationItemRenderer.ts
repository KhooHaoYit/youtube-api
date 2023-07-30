import { request } from "../../src/doApi";

export type ContinuationItemRenderer = {
  continuationEndpoint: {
    continuationCommand: {
      token: string,
    },
  },
};

export async function* listAll<
  T extends { continuationItemRenderer?: ContinuationItemRenderer }
>(data: T[], innertubeApiKey: string) {
  for (
    let continuation: null | ContinuationItemRenderer = null
    ;
    ; continuation = null
  ) {
    for (const item of data) {
      if (item.continuationItemRenderer) {
        continuation = item.continuationItemRenderer;
        continue;
      }
      yield item as Omit<T, 'continuationItemRenderer'>;
    }
    if (!continuation)
      break;
    data = await request(innertubeApiKey, {
      continuation: continuation.continuationEndpoint.continuationCommand.token,
    }).then(res => {
      if ('onResponseReceivedActions' in res)
        return res.onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems ?? [];
      if ('onResponseReceivedEndpoints' in res)
        return res.onResponseReceivedEndpoints[0].appendContinuationItemsAction.continuationItems ?? [];
      throw new Error(`Unable to extract continuation result`);
    });
  }
}
