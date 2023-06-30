import { getUrl } from '../generic/image';
import { Image } from '../generic/image';
import { getOriginalText, Runs } from '../generic/runs';
import { MetadataBadgeRenderer } from './metadataBadgeRenderer';
import { SubscriberCountText } from '../generic/subscriberCountText';
import * as subscriberCountText from '../generic/subscriberCountText';
import { ChannelHeaderLinksRenderer } from './channelHeaderLinksRenderer';

export type C4TabbedHeaderRenderer = {
  /**
   * `UCotXwY6s8pWmuWd_snKYjhg`
   */
  channelId: string,
  /**
   * not defined if channel doesn't exists
   * 
   * `hololive English`
   */
  title?: string,
  /**
   * `https://yt3.googleusercontent.com/VhHSeB6EWorOZaDonE1tOLUg4bcqUaPgYxT1BUM4JQTsCRonsnkOlogwvkq5WV0q22woZiR2=s88-c-k-c0x00ffffff-no-rj`
   */
  avatar: Image,
  /**
   * not defined if channel didn't set banner
   * 
   * `https://yt3.googleusercontent.com/dn7XokRkRJvbvQ-RE5P06eRuZ0QcI_MFFeQ2BMmOCwSarkaqxtDyqV26WrabX9bfWFQjxZSFWfk=w1060-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj`
   */
  banner?: Image,
  /**
   * not defined if channel didn't display links in channel banner
   */
  headerLinks?: {
    channelHeaderLinksRenderer: ChannelHeaderLinksRenderer
  },
  /**
   * not defined if channel doesn't have membership
   */
  sponsorButton?: {},
  /**
   * not defined if channel doesn't have any badge
   */
  badges?: MetadataBadgeRenderer[],
  /**
   * not defined if channel doesn't exists
   */
  subscribeButton?: {
    /**
     * not defined if not sub-able (like Topic channel)
     */
    subscribeButtonRenderer?: {}
  },
  /**
   * not defined if not sub-able (like Topic channel)
   */
  subscriberCountText?: SubscriberCountText,
  /**
   * not defined if channel is Topic channel
   */
  channelHandleText?: {
    /**
     * `@hololiveEnglish`
     */
    runs: Runs
  },
  /**
   * not defined if channel doesn't exists
   */
  videosCountText?: {
    /**
     * `77 videos`
     * 
     * `No videos`
     */
    runs: Runs
  },
  /**
   * contains part of description of channel
   * 
   * not defined if channel doesn't exists
   */
  tagline?: {},
};

export function getChannelId(data: C4TabbedHeaderRenderer) {
  return data.channelId;
}

export function getChannelName(data: C4TabbedHeaderRenderer) {
  return data.title;
}

export function getSubscriberCount(data: C4TabbedHeaderRenderer) {
  const text = data.subscriberCountText;
  if (!text)
    return;
  return subscriberCountText.getSubscriberCount(text);
}

export function getAvatarUrl(data: C4TabbedHeaderRenderer) {
  return getUrl(data.avatar);
}

export function getBannerUrl(data: C4TabbedHeaderRenderer) {
  if (!data.banner)
    return;
  return getUrl(data.banner);
}

export function getHandle(data: C4TabbedHeaderRenderer) {
  const runs = data.channelHandleText?.runs;
  if (!runs)
    return;
  return getOriginalText(runs)
    .replace('@', '');
}

export function isVerified(data: C4TabbedHeaderRenderer) {
  const verifiedBadgeIndex = data.badges
    ?.findIndex(badge => badge.metadataBadgeRenderer.icon.iconType === 'CHECK_CIRCLE_THICK');
  return verifiedBadgeIndex === undefined
    ? undefined
    : verifiedBadgeIndex !== -1;
}

export function haveMembershipFeature(data: C4TabbedHeaderRenderer) {
  return 'sponsorButton' in data;
}
