import { Runs } from "../generic/runs";
import { SponsorshipsPerksRenderer, getOffersInfo } from "./sponsorshipsPerksRenderer";

export type SponsorshipsTierRenderer = {
  rankId: string
  /**
   * `通常コース`
   */
  title: {
    simpleText: string
  }
  subtitle: {
    /**
     * `MYR 10.00/month`
     */
    runs: Runs
  }
  perks: {
    sponsorshipsPerksRenderer: SponsorshipsPerksRenderer
  }
};



export function getTierInfo(data: SponsorshipsTierRenderer) {
  return {
    name: data.title.simpleText,
    rankId: data.rankId,
    offers: getOffersInfo(data.perks.sponsorshipsPerksRenderer),
  };
}
