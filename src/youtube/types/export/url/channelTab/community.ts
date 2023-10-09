import { InternalServerErrorException } from "@nestjs/common";
import { Runs } from "../../generic/runs";
import { BackstagePostThreadRenderer } from "../../renderer/backstagePostThreadRenderer";
import { ContinuationItemRenderer } from "../../renderer/continuationItemRenderer";
import { ItemSectionRenderer } from "../../renderer/itemSectionRenderer";
import { SectionListRenderer } from "../../renderer/sectionListRenderer";
import * as sectionListRenderer from "../../renderer/sectionListRenderer";
import { MessageRenderer } from "../../renderer/messageRenderer";

export type Community = {
  title: 'Community',
  content?: {
    sectionListRenderer: SectionListRenderer<{
      content: {
        itemSectionRenderer: ItemSectionRenderer<{
          backstagePostThreadRenderer?: BackstagePostThreadRenderer,
          /**
           * `Comments are turned off. Learn more`
           */
          messageRenderer?: MessageRenderer
          continuationItemRenderer?: ContinuationItemRenderer,
        }>
      }
    }>,
  },
};

export function getCommunityPosts(tab: Community) {
  const posts = sectionListRenderer.getContents(tab.content!.sectionListRenderer)[0]
    .itemSectionRenderer.contents;
  if (posts[0].messageRenderer)
    return [];
  return posts as Omit<typeof posts[0], 'messageRenderer'>[];
}

export async function listAllComments(tab: Community, innertubeApiKey: string) {
  const commentsLoader = sectionListRenderer.getContents(tab.content!.sectionListRenderer)
    .at(1)
    ?.itemSectionRenderer.contents[0].continuationItemRenderer;
  if (!commentsLoader)
    return [];

  return;
}
