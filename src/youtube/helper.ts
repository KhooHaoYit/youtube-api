import { YtInitialData as ChannelPage } from "./types/export/url/channel";
import { Community } from "./types/export/url/channelTab/community";
import { Playlists } from "./types/export/url/channelTab/playlists";
import { About } from "./types/export/url/channelTab/about";
import { Home } from "./types/export/url/channelTab/home";
import { Channels } from "./types/export/url/channelTab/channels";

export function getChannelTab<T extends 'Home'>(
  data: ChannelPage,
  tabName: T,
): { tabRenderer: Home };
export function getChannelTab<T extends 'About'>(
  data: ChannelPage,
  tabName: T,
): { tabRenderer: About };
export function getChannelTab<T extends 'Playlists'>(
  data: ChannelPage,
  tabName: T,
): { tabRenderer: Playlists };
export function getChannelTab<T extends 'Channels'>(
  data: ChannelPage,
  tabName: T,
): { tabRenderer: Channels };
export function getChannelTab<T extends 'Community'>(
  data: ChannelPage,
  tabName: T,
): { tabRenderer: Community };
export function getChannelTab<T extends 'Membership'>(
  data: ChannelPage,
  tabName: T,
): { tabRenderer: any } | undefined;
export function getChannelTab<T extends string>(data: ChannelPage, tabName: T): any {
  if (!data.contents?.twoColumnBrowseResultsRenderer)
    throw new Error(`Unable to extract channel tabs`);
  return data.contents.twoColumnBrowseResultsRenderer.tabs
    .find(tab => 'tabRenderer' in tab && tab.tabRenderer?.title === tabName);
};
