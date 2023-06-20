import { Runs } from "../generic/runs";
import { SponsorshipsPerksRenderer } from "./sponsorshipsPerksRenderer";

export type SponsorshipsTierRenderer = {
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


