import { Runs } from "../generic/runs";
import { Text, getOriginalText } from "../generic/text";
import { MetadataBadgeRenderer } from "./metadataBadgeRenderer";

export type PlaylistSidebarPrimaryInfoRenderer = {
  title: Text
  stats: [
    {
      /**
       * `1,083 videos`
       */
      runs: Runs
    },
    {
      /**
       * `294,862 views`
       */
      simpleText: string
    },
    {
      /**
       * `Last updated on Jun 20, 2023` | `Updated today`
       */
      runs: Runs
    }
  ]
  description?: Text
  badges?: MetadataBadgeRenderer[]
};

export function getTitle(data: PlaylistSidebarPrimaryInfoRenderer) {
  return getOriginalText(data.title);
}

export function getDescription(data: PlaylistSidebarPrimaryInfoRenderer) {
  return data.description
    ? getOriginalText(data.description)
    : '';
}
