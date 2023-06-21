export type ChannelSubMenuRenderer = {
  contentTypeSubMenuItems: {
    endpoint: {
      browseEndpoint: {
        browseId: string,
        params: string,
      }
    },
    title: string,
    selected: boolean,
  }[],
};

export function getSubMenuItemsInfo(data: ChannelSubMenuRenderer) {
  return data.contentTypeSubMenuItems
    .filter((_, index, arr) => arr.length === 1 || index !== 0 ? true : false)
    .map((item) => [item.title, item.endpoint.browseEndpoint] as const);
}
