import { ChannelSubMenuRenderer } from "../../renderer/channelSubMenuRenderer";
import * as channelSubMenuRenderer from '../../renderer/channelSubMenuRenderer';
import { GridPlaylistRenderer } from "../../renderer/gridPlaylistRenderer";
import { GridRenderer } from "../../renderer/gridRenderer";
import { ItemSectionRenderer } from "../../renderer/itemSectionRenderer";
import { SectionListRenderer } from "../../renderer/sectionListRenderer";
import * as sectionListRenderer from '../../renderer/sectionListRenderer';

export type Playlists = {
  title: 'Playlists',
  /**
   * not defined if request aren't from /channel/CHANNEL_ID/playlists
   */
  content?: {
    sectionListRenderer: SectionListRenderer<{
      content: {
        itemSectionRenderer: ItemSectionRenderer<{
          gridRenderer?: GridRenderer<{
            gridPlaylistRenderer: GridPlaylistRenderer
          }>,
          /**
           * defined when showing multiple playlists categories
           */
          shelfRenderer?: {},
          /**
           * defined when channel doesn't have any playlists
           */
          messageRenderer?: {}
        }>,
      },
      /**
       * not defined when channel doesn't have any playlists
       */
      subMenu: { channelSubMenuRenderer: ChannelSubMenuRenderer },
    }>,
  },
};

export function getPlaylists(tab: Playlists) {
  const list = sectionListRenderer.getContents(tab.content!.sectionListRenderer)[0]
    .itemSectionRenderer.contents;
  if (list[0].messageRenderer)
    return {
      playlists: [],
      subMenu: [],
    };
  const subMenu = sectionListRenderer.getSubMenu(tab.content!.sectionListRenderer);
  return {
    playlists: list[0].gridRenderer
      ? list[0].gridRenderer.items
      : [],
    subMenu: subMenu?.channelSubMenuRenderer
      ? channelSubMenuRenderer.getSubMenuItemsInfo(subMenu.channelSubMenuRenderer)
      : [],
  };
}
