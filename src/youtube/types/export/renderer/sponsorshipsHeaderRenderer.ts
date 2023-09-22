import { SponsorshipsOfferVideoRenderer } from "./sponsorshipsOfferVideoRenderer";

export type SponsorshipsHeaderRenderer = {
  inlineVideo?: {
    sponsorshipsOfferVideoRenderer: SponsorshipsOfferVideoRenderer
  }
  [key: string]: unknown
};

export function getInlineVideoId(data: SponsorshipsHeaderRenderer) {
  return data.inlineVideo?.sponsorshipsOfferVideoRenderer.externalVideoId ?? '';
}
