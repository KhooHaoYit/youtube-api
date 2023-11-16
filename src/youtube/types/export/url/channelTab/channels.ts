import { ChannelSubMenuRenderer } from "../../renderer/channelSubMenuRenderer";
import { ContinuationItemRenderer } from "../../renderer/continuationItemRenderer";
import { GridChannelRenderer } from "../../renderer/gridChannelRenderer";
import { GridRenderer } from "../../renderer/gridRenderer";
import { ItemSectionRenderer } from "../../renderer/itemSectionRenderer";
import { MessageRenderer } from "../../renderer/messageRenderer";
import { SectionListRenderer } from "../../renderer/sectionListRenderer";

export type Channels = {
  title: 'Channels',
  /**
   * not defined if request isn't requesting /channel/CHANNEL_ID/channels
   */
  content?: {
    sectionListRenderer: SectionListRenderer<{
      content: {
        itemSectionRenderer: ItemSectionRenderer<{
          gridRenderer?: GridRenderer<{
            gridChannelRenderer?: GridChannelRenderer,
            continuationItemRenderer?: ContinuationItemRenderer
          }>,
          /**
           * defined when showing multiple channel categories
           */
          shelfRenderer?: {
            // "content"?: {},
          },
          /**
           * defined when channel doesn't have any subs
           * 
           * `This channel doesn't feature any other channels.`
           */
          messageRenderer?: MessageRenderer
        }>,
      }[],
      /**
       * not defined when channel doesn't have any subs
       */
      subMenu: { channelSubMenuRenderer: ChannelSubMenuRenderer },
    }>
  },
};
