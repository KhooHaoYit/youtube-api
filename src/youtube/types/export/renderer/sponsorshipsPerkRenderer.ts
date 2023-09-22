import { Image } from "../generic/image";
import * as image from "../generic/image";
import { Runs } from "../generic/runs";
import * as runs from "../generic/runs";
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
  fulfillmentInstructions?: {
    runs: Runs
  }
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
    title: data.title.simpleText
      ?? runs.getOriginalText(data.title.runs!),
    description: data.description?.simpleText
      ?? '',
    instructions: data.fulfillmentInstructions
      ? runs.getOriginalText(data.fulfillmentInstructions.runs)
      : '',
    images: data.images
      ?.map(img => [
        image.getName(img)!,
        image.getUrl(img),
      ] satisfies [url: string, label: string])
      ?? [],
  };
}
