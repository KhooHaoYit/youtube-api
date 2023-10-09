import { Image } from "../generic/image";
import { Text } from "../generic/text";

export type ChannelHeaderLinksRenderer = {
  primaryLinks: {
    navigationEndpoint: {
      urlEndpoint: { url: string },
    },
    icon: Image
    title: Text,
  }[],
  secondaryLinks?: {
    navigationEndpoint: {
      urlEndpoint: { url: string },
    },
    icon: Image
    title: Text,
  }[],
};


