import { Image } from "../generic/image";
import * as image from "../generic/image";
import { Runs } from "../generic/runs";
import { SponsorshipsLoyaltyBadgesRenderer } from "./sponsorshipsLoyaltyBadgesRenderer";
import * as sponsorshipsLoyaltyBadgesRenderer from "./sponsorshipsLoyaltyBadgesRenderer";

export type SponsorshipsPerkRenderer = {
  title: {
    /**
     * membership level perk's title (not the same as `runs` key)
     */
    simpleText?: string,
    runs?: Runs
  }
  description?: {
    /**
     * membership level perk's description
     */
    simpleText: string,
  }
  loyaltyBadges?: {
    sponsorshipsLoyaltyBadgesRenderer: SponsorshipsLoyaltyBadgesRenderer
  }
  /**
   * emojis
   */
  images?: Image[]
};

export function getBadges(data: SponsorshipsPerkRenderer) {
  const badges = data.loyaltyBadges?.sponsorshipsLoyaltyBadgesRenderer;
  if (!badges)
    return;
  return sponsorshipsLoyaltyBadgesRenderer.getBadgeLevels(badges);
}

export function getEmojis(data: SponsorshipsPerkRenderer) {
  return data.images
    ?.map(img => [image.getName(img), image.getUrl(img)] as [string, string]);
}
