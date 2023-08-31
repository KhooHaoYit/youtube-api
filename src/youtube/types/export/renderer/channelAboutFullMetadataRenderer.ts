import { Image } from "../generic/image";
import * as image from "../generic/image";
import { ViewCountText } from "../generic/viewCountText";
import * as viewCountText from "../generic/viewCountText";

export type ChannelAboutFullMetadataRenderer = {
  "description"?: {
    "simpleText": string,
  },
  /**
   * not defined if user didn't set any links
   */
  links?: {
    channelExternalLinkViewModel: {
      title: {
        content: string
      }
      link: {
        content: string
      }
    }
  }[]
  /**
   * not defined when channel doesn't have views
   */
  "viewCountText"?: ViewCountText,
  "joinedDateText": {
    "runs": [
      {
        "text": "Joined "
      },
      {
        /**
         * `Mar 3, 2016`
         */
        "text": string
      }
    ]
  },
  /**
   * `http://www.youtube.com/@hololive`
   */
  "canonicalChannelUrl": string,
  "bypassBusinessEmailCaptcha": false,
  "title": {
    /**
     * `hololive ホロライブ - VTuber Group`
     */
    "simpleText": string,
  },
  "avatar": {
    "thumbnails": {
      /**
       * `https://yt3.googleusercontent.com/ytc/AGIKgqPh-i0-rT3LcMstPws5jlp4CkvsBgzVvDjaFrWtlw=s48-c-k-c0x00ffffff-no-rj`
       */
      "url": string,
    }[],
  },
  "country"?: {
    /**
     * `Japan`
     */
    "simpleText": string
  },
  "channelId": string,
  /**
   * not defined when channel didn't set any business email
   */
  signInForBusinessEmail?: {},
};

export function getViewCount(data: ChannelAboutFullMetadataRenderer) {
  if (!data.viewCountText)
    return;
  return viewCountText.getViewCount(data.viewCountText);
}

export type Link = [title: string, iconUrl: string | null, url: string | null];
export function getLinks(data: ChannelAboutFullMetadataRenderer) {
  if (!data.links)
    return [];
  return data.links.map(link => [
    link.channelExternalLinkViewModel.title.content,
    null,
    link.channelExternalLinkViewModel.link.content,
  ] as Link);
}
