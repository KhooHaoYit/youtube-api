import { NavigationEndpoint } from "../generic/navigationEndpoint";
import { Text } from "../generic/text";

export type CompactRadioRenderer = {
  playlistId: string
  /**
   * `Mix - HAACHAMA Ch 赤井はあと`
   */
  title: Text
  navigationEndpoint: NavigationEndpoint
};
