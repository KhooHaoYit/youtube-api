import {
  Channel,
  TabAbout,
  TabChannels,
  TabHome,
  TabPlaylists,
} from "./types/export/channel";
import { VideoPlayerResponse } from "./types/export/video";

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
export function getChannelTab<T extends 'Membership'>(
  data: Channel,
  tabName: T,
): { tabRenderer: any } | undefined;
export function getChannelTab<T extends string>(data: Channel, tabName: T): any {
  if (!('twoColumnBrowseResultsRenderer' in data.contents))
    throw new Error(`Unable to extract channel tabs`);
  return data.contents.twoColumnBrowseResultsRenderer.tabs
    .find(tab => 'tabRenderer' in tab && tab.tabRenderer.title === tabName);
};

export function extractErrorMessage(data: VideoPlayerResponse) {
  let output: undefined | string;
  if (output = data.playabilityStatus.messages?.[0])
    return output;
  if (output = data.playabilityStatus.errorScreen?.playerErrorMessageRenderer?.subreason?.simpleText)
    return output;
  if (output = data.playabilityStatus.errorScreen?.playerErrorMessageRenderer?.subreason?.runs?.map(run => run.text).join(''))
    return output;
  return data.playabilityStatus.reason;
}
