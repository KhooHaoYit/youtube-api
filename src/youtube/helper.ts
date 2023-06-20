import {
  Channel,
  TabAbout,
  TabChannels,
  TabCommunity,
  TabHome,
  TabPlaylists,
} from "./types/export/channel";

export function getChannelTab<T extends 'Home'>(
  data: Channel,
  tabName: T,
): { tabRenderer: TabHome };
export function getChannelTab<T extends 'About'>(
  data: Channel,
  tabName: T,
): { tabRenderer: TabAbout };
export function getChannelTab<T extends 'Playlists'>(
  data: Channel,
  tabName: T,
): { tabRenderer: TabPlaylists };
export function getChannelTab<T extends 'Channels'>(
  data: Channel,
  tabName: T,
): { tabRenderer: TabChannels };
export function getChannelTab<T extends 'Community'>(
  data: Channel,
  tabName: T,
): { tabRenderer: TabCommunity };
export function getChannelTab<T extends 'Membership'>(
  data: Channel,
  tabName: T,
): { tabRenderer: any } | undefined;
export function getChannelTab<T extends string>(data: Channel, tabName: T): any {
  if (!data.contents || !('twoColumnBrowseResultsRenderer' in data.contents))
    throw new Error(`Unable to extract channel tabs`);
  return data.contents.twoColumnBrowseResultsRenderer.tabs
    .find(tab => 'tabRenderer' in tab && tab.tabRenderer.title === tabName);
};
