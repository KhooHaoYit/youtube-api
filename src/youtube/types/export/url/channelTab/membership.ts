import { BackstagePostThreadRenderer } from "../../renderer/backstagePostThreadRenderer";
import { ContinuationItemRenderer } from "../../renderer/continuationItemRenderer";
import { ItemSectionRenderer } from "../../renderer/itemSectionRenderer";
import { SectionListRenderer } from "../../renderer/sectionListRenderer";
import { SponsorshipsAlertRenderer } from "../../renderer/sponsorshipsAlertRenderer";
import { SponsorshipsExpandablePerksRenderer } from "../../renderer/sponsorshipsExpandablePerksRenderer";
import { VideoRenderer } from "../../renderer/videoRenderer";

export type Membership = {
  title: 'Membership',
  content?: {
    sectionListRenderer: SectionListRenderer<{
      content: {
        sponsorshipsExpandablePerksRenderer?: SponsorshipsExpandablePerksRenderer
        itemSectionRenderer?: ItemSectionRenderer<{
          sponsorshipsAlertRenderer?: SponsorshipsAlertRenderer
          backstagePostThreadRenderer?: BackstagePostThreadRenderer
          videoRenderer?: VideoRenderer
          continuationItemRenderer?: ContinuationItemRenderer
        }>
      }
    }>,
  },
};
