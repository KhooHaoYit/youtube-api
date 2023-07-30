import { Injectable } from '@nestjs/common';
import { Visibility } from '@prisma/client';
import {
  getBasicInfo as _getBasicInfo,
} from 'ytdl-core';
import { AppHandleUpdate } from './app.handleUpdate';

@Injectable()
export class AppService {

  constructor(
    private model: AppHandleUpdate,
  ) { }

  async updateVideo(id: string) {
    const result = await getBasicInfo(id)
      .catch((err: Error) => err);
    if (result instanceof Error) {
      switch (result.message) {
        default:
          console.log(id, result.message);
          throw result;
        // reason might be livestream too long that video is gone
        // https://youtu.be/ugR0OVGohwo
        case '':
          return void await this.model.handleVideoUpdate({
            id,
          });
        // const a = {};
        // this.#handleVideoUpdate({
        //   id,
        //   keywords: a.videoDetails.keywords,
        //   viewCount: +a.videoDetails.viewCount,
        //   title: a.videoDetails.title,
        //   duration: a.videoDetails.lengthSeconds,
        //   channelId: a.videoDetails.channelId,
        //   removedReason: a.playabilityStatus.errorScreen.playerErrorMessageRenderer.subreason.runs.map(run => run.text).join(''),
        //   description: a.videoDetails.shortDescription,
        //   isLivestream: a.videoDetails.isLiveContent,
        //   publishDate: a.microformat.playerMicroformatRenderer.publishDate,
        //   uploadDate: a.microformat.playerMicroformatRenderer.uploadDate,
        //   category: a.microformat.playerMicroformatRenderer.category,
        //   isMembershipContent: a.data.contents.twoColumnWatchNextResults.results.results.contents[0].videoPrimaryInfoRenderer.badges.findIndex(badge => badge.metadataBadgeRenderer.label === 'Members only') !== -1,
        //   visibility: a.microformat.playerMicroformatRenderer.isUnlisted
        //     ? Visibility.unlisted
        //     : Visibility.,
        // });
        case `This video has been removed for violating YouTube's policy on hate speech. Learn more about combating hate speech in your country.`:
        case `This video has been removed for violating YouTube's policy on spam, deceptive practices, and scams`:
        case `This video has been removed for violating YouTube's policy on violent or graphic content`:
        case `This video has been removed for violating YouTube's policy on nudity or sexual content`:
        case `This video has been removed for violating YouTube's policy on harassment and bullying`:
        case `This video has been removed for violating YouTube's Community Guidelines`:
        case `This video has been removed for violating YouTube's Terms of Service`:
          return void await this.model.handleVideoUpdate({
            id,
            visibility: Visibility.removed,
            removedReason: result.message,
          });
        case 'This is a private video. Please sign in to verify that you may see it.':
          return void await this.model.handleVideoUpdate({
            id,
            visibility: Visibility.private,
          });
        case 'This video is unavailable': // https://youtu.be/2qBaGjR9Pcs
        case 'Video unavailable': // https://youtu.be/x49qLxOIwTE
          return void await this.model.handleVideoUpdate({
            id,
            visibility: Visibility.deleted,
          });
        case 'Status code: 410':
          return void await this.model.handleVideoUpdate({
            id,
            isAgeRestricted: true,
          });
      }
    }
    Promise.all(
      result.related_videos.map(video => [
        video.id && this.model.handleVideoUpdate({
          id: video.id,
          title: video.title,
          visibility: Visibility.public,
          isLivestream: video.isLive,
          viewCount: typeof video.view_count === 'string' ? +video.view_count : undefined,
          duration: video.length_seconds,
          channelId: typeof video.author === 'string' ? video.author : video.author.id,
        }),
        typeof video.author === 'object' && this.model.handleChannelUpdate({
          id: video.author.id,
          name: video.author.name,
          handle: video.author.user,
          verified: video.author.verified,
          avatarUrl: video.author.thumbnails?.at(0)?.url,
        }),
      ]).flat(),
    ).catch(() => { });
    // https://www.youtube.com/channel/UCFNosi99Sp0_eLilBiXmmXA/videos
    // https://www.youtube.com/channel/UCSDvKdIQOwTfcyOimSi9oYA/videos
    await Promise.all([
      this.model.handleVideoUpdate({
        id: result.videoDetails.videoId,
        channelId: result.videoDetails.author.id,
        title: result.videoDetails.title,
        description: result.videoDetails.description,
        isLivestream: result.videoDetails.isLiveContent,
        liveStartTimestamp: result.videoDetails.liveBroadcastDetails?.startTimestamp,
        liveEndTimestamp: result.videoDetails.liveBroadcastDetails?.endTimestamp,
        isMembershipContent: result.player_response.playabilityStatus.status !== 'OK',
        visibility: Visibility[result.videoDetails.isUnlisted ? 'unlisted' : 'public'],
        viewCount: +result.videoDetails.viewCount,
        uploadDate: result.videoDetails.uploadDate,
        isAgeRestricted: result.videoDetails.age_restricted,
        category: result.videoDetails.category,
        duration: +result.videoDetails.lengthSeconds,
        keywords: result.videoDetails.keywords,
        publishDate: result.videoDetails.publishDate,
      }),
      this.model.handleChannelUpdate({
        id: result.videoDetails.author.id,
        subscriberCount: result.videoDetails.author.subscriber_count,
        verified: result.videoDetails.author.verified,
        name: result.videoDetails.author.name,
        handle: result.videoDetails.author.user,
        avatarUrl: result.videoDetails.author.thumbnails?.at(0)?.url,
      }),
    ]);
  }

}

let mutex: Promise<void> = Promise.resolve();
async function getBasicInfo(
  ...args: Parameters<typeof _getBasicInfo>
): ReturnType<typeof _getBasicInfo> {
  let resolve: (value?: any) => void;
  const newMutex = new Promise<void>(rs => resolve = rs);
  const oldMutex = mutex;
  mutex = newMutex;
  await oldMutex;
  return await _getBasicInfo(...args)
    .finally(() => resolve());
}
