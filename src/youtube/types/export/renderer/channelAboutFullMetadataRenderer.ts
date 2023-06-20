import { Image } from "../generic/image";
import * as image from "../generic/image";
import { ViewCountText } from "../generic/viewCountText";

export type ChannelAboutFullMetadataRenderer = {
  "description"?: {
    "simpleText": string,
  },
  /**
   * not defined if user didn't set any links
   */
  "primaryLinks"?: {
    "navigationEndpoint": {
      "urlEndpoint": {
        /**
         * `https://www.youtube.com/redirect?event=channel_description&redir_token=QUFFLUhqbTFwRnFOMC01UXNQek4yUER6OXpIT2Q3LWt6Z3xBQ3Jtc0tuNnA3Y0tWTTgzeXc1aVlXUmZvWXdlZjZGZWVvQVVSWU90MEliYVhLazE3ZWlWOW96QzdIVHB3c2p1VmptMnJXT2t3R3VseG5IQThPTW5mQnRsc0tyZzhMMS1FV2VJZnJWUUNOUXVYTVM1TjNmYk1qdw&q=https%3A%2F%2Ftwitter.com%2Fhololivetv`
         */
        "url": string,
      }
    },
    /**
     * `https://encrypted-tbn0.gstatic.com/favicon-tbn?q=tbn:ANd9GcTCl87OfLKVJ9rK8xDL2fO43Nn-qwO3MZqhD6Va_y_Dj4NQN5vi_7wfFsqVPVk5OJarybTLaqbvqdn3Oj1nmlMBa_srPR9cF0lTX47Loj-ftw`
     * 
     * TODO: find if this might be undefined
     */
    "icon": Image,
    "title": {
      /**
       * `公式Twitter`
       */
      "simpleText": string,
    },
  }[],
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

export type Link = [title: string, iconUrl: string | null, url: string | null];
export function getLinks(data: ChannelAboutFullMetadataRenderer) {
  return data.primaryLinks?.map(link => {
    let extractUrl: string;
    try {
      const url = new URL(link.navigationEndpoint.urlEndpoint.url);
      extractUrl = url.hostname === 'www.youtube.com' && url.pathname === '/redirect'
        ? url.searchParams.get('q')!
        : url.href;
    } catch {
      extractUrl = link.navigationEndpoint.urlEndpoint.url;
    }
    return [
      link.title.simpleText,
      image.getUrl(link.icon) || null,
      extractUrl,
    ] as Link;
  });
}
