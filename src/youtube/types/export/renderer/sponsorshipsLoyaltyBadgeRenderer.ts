import { Image } from "../generic/image";
import * as image from "../generic/image";
import { Text, getOriginalText } from "../generic/text";

export type SponsorshipsLoyaltyBadgeRenderer = {
  icon: Image,
  /**
   * `New-member badge:`
   * 
   * `Month 1 badge:`
   * 
   * `Month ${number} badge:`
   */
  title: Text
};

export function getBadgeImageUrl(data: SponsorshipsLoyaltyBadgeRenderer) {
  return image.getUrl(data.icon);
}

export function getBadgeMonthRequirement(data: SponsorshipsLoyaltyBadgeRenderer) {
  const digits = getOriginalText(data.title).match(/\d+/)?.[0];
  if (!digits)
    return 0;
  return +digits;
}
