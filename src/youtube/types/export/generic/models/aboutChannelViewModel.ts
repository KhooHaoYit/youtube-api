import { ChannelExternalLinkViewModel, getLinkInfo } from "./channelExternalLinkViewModel"

export type AboutChannelViewModel = {
  description?: string
  /**
   * `962,787,154 views`
   */
  viewCountText?: string
  country?: string
  /**
   * `2.23M subscribers`
   */
  subscriberCountText?: string
  joinedDateText: {
    /**
     * `Joined Mar 3, 2016`
     */
    content: string
  }
  /**
   * `1,075 videos`
   */
  videoCountText?: string
  links?: {
    channelExternalLinkViewModel: ChannelExternalLinkViewModel
  }[]
  signInForBusinessEmail?: {}
  /**
   * `http://www.youtube.com/@rachie`
   */
  canonicalChannelUrl: string
  channelId: string
  artistBio?: {
    content: string
  }
}

export function getChannelInfo(data: AboutChannelViewModel) {
  return {
    joinedAt: data.joinedDateText.content.replace('Joined ', ''),
    links: data.links?.map(link => getLinkInfo(link.channelExternalLinkViewModel)) ?? [],
    handle: data.canonicalChannelUrl.split('@').at(-1)!,
    description: data.description ?? '',
    channelId: data.channelId,
    viewCount: data.viewCountText
      ? BigInt(data.viewCountText.split(' ')[0].replace(/,/g, ''))
      : 0n,
    haveBusinessEmail: !!data.signInForBusinessEmail,
    country: data.country ?? null,
    artistBio: data.artistBio?.content ?? null,
    
  };
}
