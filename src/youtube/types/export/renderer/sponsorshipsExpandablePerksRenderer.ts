import { Image } from "../generic/image";
import { SponsorshipsPerkRenderer } from "./sponsorshipsPerkRenderer";

export type SponsorshipsExpandablePerksRenderer = {
  /**
   * Current user badge
   */
  badge: Image,
  /**
   * Current user membership level's name
   */
  expandableHeader: {
    simpleText: string
  }
  expandableItems: {
    sponsorshipsPerkRenderer: SponsorshipsPerkRenderer
  }[]
};


