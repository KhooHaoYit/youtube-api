import { Runs } from "../generic/runs";
import * as runs from "../generic/runs";

export type PlaylistSidebarPrimaryInfoRenderer = {
  title: { runs: Runs }
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
  description?: {
    simpleText?: string
  }
};

export function getTitle(data: PlaylistSidebarPrimaryInfoRenderer) {
  return runs.getOriginalText(data.title.runs);
}

export function getDescription(data: PlaylistSidebarPrimaryInfoRenderer) {
  return data.description?.simpleText ?? '';
}
