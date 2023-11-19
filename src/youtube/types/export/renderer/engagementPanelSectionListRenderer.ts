import { EngagementPanelTitleHeaderRenderer } from "./engagementPanelTitleHeaderRenderer";
import { ItemSectionRenderer } from "./itemSectionRenderer";
import { SectionListRenderer } from "./sectionListRenderer";

export type EngagementPanelSectionListRenderer<T> = {
  header: {
    engagementPanelTitleHeaderRenderer: EngagementPanelTitleHeaderRenderer
  }
  content: {
    sectionListRenderer: SectionListRenderer<{
      content: {
        itemSectionRenderer: ItemSectionRenderer<T>
      }
    }>
  }
};
