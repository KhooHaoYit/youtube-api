import { ChannelAboutFullMetadataRenderer } from "../../renderer/channelAboutFullMetadataRenderer";
import { ItemSectionRenderer } from "../../renderer/itemSectionRenderer";
import { SectionListRenderer } from "../../renderer/sectionListRenderer";

export type About = {
  title: 'About',
  "content"?: {
    sectionListRenderer: SectionListRenderer<{
      content: {
        itemSectionRenderer: ItemSectionRenderer<{
          channelAboutFullMetadataRenderer: ChannelAboutFullMetadataRenderer
        }>,
      }
    }>
  }
};
