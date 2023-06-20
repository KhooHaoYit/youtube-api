import { SponsorshipsLoyaltyBadgeRenderer } from "./sponsorshipsLoyaltyBadgeRenderer";
import * as sponsorshipsLoyaltyBadgeRenderer from "./sponsorshipsLoyaltyBadgeRenderer";

export type SponsorshipsLoyaltyBadgesRenderer = {
  loyaltyBadges: {
    sponsorshipsLoyaltyBadgeRenderer: SponsorshipsLoyaltyBadgeRenderer
  }[]
};

export function getBadgeLevels(data: SponsorshipsLoyaltyBadgesRenderer) {
  return data.loyaltyBadges.map(badge => [
    sponsorshipsLoyaltyBadgeRenderer.getBadgeMonthRequirement(badge.sponsorshipsLoyaltyBadgeRenderer),
    sponsorshipsLoyaltyBadgeRenderer.getBadgeImageUrl(badge.sponsorshipsLoyaltyBadgeRenderer),
  ] as [number, string]);
}
