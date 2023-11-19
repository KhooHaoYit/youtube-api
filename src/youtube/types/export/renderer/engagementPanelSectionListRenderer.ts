import { AboutChannelRenderer } from "./aboutChannelRenderer";
import { ItemSectionRenderer } from "./itemSectionRenderer";
import { SectionListRenderer } from "./sectionListRenderer";

export type EngagementPanelSectionListRenderer = {
  content: {
    sectionListRenderer: SectionListRenderer<{
      content: {
        itemSectionRenderer: ItemSectionRenderer<{
          aboutChannelRenderer: AboutChannelRenderer
        }>
      }
    }>
  }
};
