import { SponsorshipsPerkRenderer } from "./sponsorshipsPerkRenderer";
import * as sponsorshipsPerkRenderer from "./sponsorshipsPerkRenderer";

export type SponsorshipsPerksRenderer = {
  perks: {
    sponsorshipsPerkRenderer: SponsorshipsPerkRenderer
  }[]
};

export function getOffersInfo(data: SponsorshipsPerksRenderer) {
  return data.perks.map(perk => sponsorshipsPerkRenderer.getOfferInfo(perk.sponsorshipsPerkRenderer));
}
