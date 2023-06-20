import { Image } from "../generic/image";
import * as image from "../generic/image";
import { Runs } from "../generic/runs";
import * as runs from "../generic/runs";

export type SponsorshipsLoyaltyBadgeRenderer = {
  icon: Image,
  /**
   * `New-member badge:`
   * 
   * `Month 1 badge:`
   * 
   * `Month ${number} badge:`
   */
  title: { runs: Runs }
};

export function getBadgeImageUrl(data: SponsorshipsLoyaltyBadgeRenderer) {
  return image.getUrl(data.icon);
}

export function getBadgeMonthRequirement(data: SponsorshipsLoyaltyBadgeRenderer) {
  const digits = runs.getOriginalText(data.title.runs).match(/\d+/)?.[0];
  if (!digits)
    return 0;
  return +digits;
}
