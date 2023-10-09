import { Text, getOriginalText } from "../generic/text";
import { SponsorshipsPerksRenderer, getOffersInfo } from "./sponsorshipsPerksRenderer";

export type SponsorshipsTierRenderer = {
  rankId: string
  /**
   * `通常コース`
   */
  title: Text
  /**
   * `MYR 10.00/month`
   */
  subtitle: Text
  perks: {
    sponsorshipsPerksRenderer: SponsorshipsPerksRenderer
  }
};



export function getTierInfo(data: SponsorshipsTierRenderer) {
  return {
    name: getOriginalText(data.title),
    rankId: data.rankId,
    offers: getOffersInfo(data.perks.sponsorshipsPerksRenderer),
  };
}
