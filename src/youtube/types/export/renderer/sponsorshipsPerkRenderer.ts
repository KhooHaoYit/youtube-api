import { Image } from "../generic/image";
import * as image from "../generic/image";
import { Text, getOriginalText } from "../generic/text";
import { SponsorshipsLoyaltyBadgesRenderer } from "./sponsorshipsLoyaltyBadgesRenderer";
import * as sponsorshipsLoyaltyBadgesRenderer from "./sponsorshipsLoyaltyBadgesRenderer";

export type SponsorshipsPerkRenderer = {
  /**
   * membership level perk's title (not the same as `runs` key)
   */
  title: Text
  /**
   * membership level perk's description
   */
  description?: Text
  fulfillmentInstructions?: Text
  loyaltyBadges?: {
    sponsorshipsLoyaltyBadgesRenderer: SponsorshipsLoyaltyBadgesRenderer
  }
  images?: Image[]
};

export function getBadgesInfo(data: SponsorshipsPerkRenderer) {
  const badges = data.loyaltyBadges?.sponsorshipsLoyaltyBadgesRenderer;
  if (!badges)
    return;
  return sponsorshipsLoyaltyBadgesRenderer.getBadgeLevels(badges);
}

export function getOfferInfo(data: SponsorshipsPerkRenderer) {
  return {
    title: getOriginalText(data.title),
    description: data.description
      ? getOriginalText(data.description)
      : '',
    instructions: data.fulfillmentInstructions
      ? getOriginalText(data.fulfillmentInstructions)
      : '',
    images: data.images
      ?.map(img => [
        image.getName(img)!,
        image.getUrl(img),
      ] satisfies [url: string, label: string])
      ?? [],
  };
}
