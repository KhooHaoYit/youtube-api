export type ChannelHeaderLinksRenderer = {
  primaryLinks: {
    navigationEndpoint: {
      urlEndpoint: { url: string },
    },
    icon: {
      thumbnails: { url: string }[],
    },
    title: { simpleText: string },
  }[],
  secondaryLinks?: {
    navigationEndpoint: {
      urlEndpoint: { url: string },
    },
    icon: {
      thumbnails: { url: string }[],
    },
    title: { simpleText: string },
  }[],
};


