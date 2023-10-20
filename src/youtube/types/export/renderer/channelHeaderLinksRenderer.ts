import { Image } from "../generic/image";
import { NavigationEndpoint } from "../generic/navigationEndpoint";
import { Text } from "../generic/text";

export type ChannelHeaderLinksRenderer = {
  primaryLinks: {
    navigationEndpoint: NavigationEndpoint
    icon: Image
    title: Text
  }[],
  secondaryLinks?: {
    navigationEndpoint: NavigationEndpoint
    icon: Image
    title: Text
  }[],
};


