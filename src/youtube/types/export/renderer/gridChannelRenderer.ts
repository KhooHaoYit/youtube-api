import { SubscriberCountText } from '../generic/subscriberCountText';
import * as subscriberCountText from '../generic/subscriberCountText';
import { getUrl, Image } from '../generic/image';
import { MetadataBadgeRenderer } from './metadataBadgeRenderer';
import { Text } from '../generic/text';
import { NavigationEndpoint } from '../generic/navigationEndpoint';

export type GridChannelRenderer = {
  channelId: string,
  /**
   * `//yt3.googleusercontent.com/B2tq3IQAFxUe9W3MaMc0V62bmlTWCSoTuCk-Y-Ab8yXkZKdIswQhHABZhz2e4YM1-B_Kxen_7w=s48-c-k-c0x00ffffff-no-rj-mo`
   */
  thumbnail: Image,
  /**
   * not defined when channel hid sub button
   * 
   * https://youtube.com/channel/UCRMpIxnySp7Fy5SbZ8dBv2w
   */
  subscriberCountText?: SubscriberCountText,
  navigationEndpoint: NavigationEndpoint
  /**
   * `Miko Ch. さくらみこ`
   */
  title: Text
  ownerBadges?: MetadataBadgeRenderer[],
};

export function getChannelId(data: GridChannelRenderer) {
  return data.channelId;
}

export function getChannelHandle(data: GridChannelRenderer) {
  const handle = data.navigationEndpoint.browseEndpoint?.canonicalBaseUrl
    ?.replace(/^[^@]@*/, '');
  if (!handle)
    throw new Error('Expected to have handle');
  return handle;
}

export function getChannelAvatarUrl(data: GridChannelRenderer) {
  return getUrl(data.thumbnail);
}

export function getSubscriberCount(data: GridChannelRenderer) {
  const text = data.subscriberCountText;
  if (!text)
    return;
  return subscriberCountText.getSubscriberCount(text);
}
