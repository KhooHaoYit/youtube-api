import { SponsorshipsHeaderRenderer, getInlineVideoId } from "./sponsorshipsHeaderRenderer";
import { SponsorshipsTierRenderer, getTierInfo } from "./sponsorshipsTierRenderer";

export type SponsorshipsOfferRenderer = {
  header: {
    sponsorshipsHeaderRenderer: SponsorshipsHeaderRenderer
  }
  tiers: {
    sponsorshipsTierRenderer: SponsorshipsTierRenderer
  }[]
};

export function getOfferInfo(data: SponsorshipsOfferRenderer) {
  return {
    tiers: data.tiers.map(tier => getTierInfo(tier.sponsorshipsTierRenderer)),
    inlineVideoId: getInlineVideoId(data.header.sponsorshipsHeaderRenderer),
  };
}
