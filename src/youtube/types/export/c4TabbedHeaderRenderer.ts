import { MetadataBadgeRenderer } from './metadataBadgeRenderer';

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
  avatar: {
    thumbnails: {
      /**
       * `https://yt3.googleusercontent.com/VhHSeB6EWorOZaDonE1tOLUg4bcqUaPgYxT1BUM4JQTsCRonsnkOlogwvkq5WV0q22woZiR2=s88-c-k-c0x00ffffff-no-rj`
       */
      url: string,
    }[],
  },
  /**
   * not defined if channel didn't set banner
   */
  banner?: {
    thumbnails: {
      /**
       * `https://yt3.googleusercontent.com/dn7XokRkRJvbvQ-RE5P06eRuZ0QcI_MFFeQ2BMmOCwSarkaqxtDyqV26WrabX9bfWFQjxZSFWfk=w1060-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj`
       */
      url: string,
    }[],
  },
  /**
   * not defined if channel didn't display links in channel banner
   */
  headerLinks?: {
    channelHeaderLinksRenderer: {
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
    }
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
    buttonRenderer?: {}
  },
  /**
   * not defined if not sub-able (like Topic channel)
   */
  subscriberCountText?: {
    /**
     * `585K subscribers`
     */
    simpleText: string,
  },
  /**
   * not defined if channel is Topic channel
   */
  channelHandleText?: {
    runs: [{
      /**
     * `@hololiveEnglish`
     */
      text: string,
    }],
  },
  /**
   * not defined if channel doesn't exists
   */
  videosCountText?: {
    runs: [
      {
        /**
         * `77`
         */
        text: string
      },
      {
        text: " videos"
      }
    ] | [{ text: 'No videos' }],
  },
  /**
   * contains part of description of channel
   * 
   * not defined if channel doesn't exists
   */
  tagline?: {},
};
