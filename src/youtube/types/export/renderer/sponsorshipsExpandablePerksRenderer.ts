import { Image } from "../generic/image";
import { SponsorshipsPerkRenderer, getBadgesInfo, getOfferInfo } from "./sponsorshipsPerkRenderer";

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

export function getCurrentPerksInfo(data: SponsorshipsExpandablePerksRenderer) {
  return {
    badges: getBadgesInfo(data.expandableItems[0].sponsorshipsPerkRenderer),
    emojis: getOfferInfo(data.expandableItems[1].sponsorshipsPerkRenderer).images,
  };
}
