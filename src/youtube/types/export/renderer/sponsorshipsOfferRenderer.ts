import { SponsorshipsHeaderRenderer } from "./sponsorshipsHeaderRenderer";
import { SponsorshipsTierRenderer } from "./sponsorshipsTierRenderer";

export type SponsorshipsOfferRenderer = {
  header: {
    sponsorshipsHeaderRenderer: SponsorshipsHeaderRenderer
  }
  tiers: {
    sponsorshipsTierRenderer: SponsorshipsTierRenderer
  }[]
};
