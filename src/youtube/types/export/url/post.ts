import { Community } from './channelTab/community';

export type Post = {
  innertubeApiKey: string | null,
  ytInitialData: YtInitialData | null,
  ytInitialPlayerResponse: null,
};



type YtInitialData = {
  contents: {
    twoColumnBrowseResultsRenderer: {
      tabs: {
        tabRenderer: Omit<Community, 'title'>
      }[]
    }
  }
};
