import { MetadataBadgeRenderer } from './metadataBadgeRenderer';

export type GridChannelRenderer = {
  channelId: string,
  thumbnail: {
    /**
     * `//yt3.googleusercontent.com/B2tq3IQAFxUe9W3MaMc0V62bmlTWCSoTuCk-Y-Ab8yXkZKdIswQhHABZhz2e4YM1-B_Kxen_7w=s48-c-k-c0x00ffffff-no-rj-mo`
     */
    thumbnails: { url: string }[],
  },
  /**
   * not defined when channel hid sub button
   * 
   * https://youtube.com/channel/UCRMpIxnySp7Fy5SbZ8dBv2w
   */
  subscriberCountText?: {
    /**
     * `778K subscribers`
     */
    simpleText: string,
  },
  navigationEndpoint: {
    browseEndpoint: {
      canonicalBaseUrl: string
    }
  },
  title: {
    /**
     * `Miko Ch. さくらみこ`
     */
    simpleText: string,
  },
  ownerBadges?: MetadataBadgeRenderer[],
};
