import { OneOfKeyWithEmpty } from "src/common/typeUtils"
import { NavigationEndpoint } from "../generic/navigationEndpoint"
import { MacroMarkersListItemRenderer } from "./macroMarkersListItemRenderer"

export type HorizontalCardListRenderer = {
  cards: OneOfKeyWithEmpty<{
    macroMarkersListItemRenderer: MacroMarkersListItemRenderer
    videoAttributeViewModel: {
      image: {
        sources: [{ url: string }]
      }
      title: string
      subtitle: string
      secondarySubtitle: {
        content: string
      }
      onTap?: {
        innertubeCommand: NavigationEndpoint
      }
    }
  }>[]
}

export function getSong(data: HorizontalCardListRenderer) {
  return data.cards.map(card => {
    if (card.videoAttributeViewModel)
      return {
        title: card.videoAttributeViewModel.title,
        subtitle: card.videoAttributeViewModel.subtitle,
        secondarySubtitle: card.videoAttributeViewModel.secondarySubtitle,
        imageUrl: card.videoAttributeViewModel.image.sources[0].url
          .replace(/=[^]+|$/, '=s0'),

      };
  });
}
