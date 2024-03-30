import { NavigationEndpoint } from "../generic/navigationEndpoint"
import { Text } from "../generic/text"

export type MacroMarkersListItemRenderer = {
  title: Text
  onTap: NavigationEndpoint
}
