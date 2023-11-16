import { NavigationEndpoint } from "../generic/navigationEndpoint"

export type SortFilterSubMenuRenderer = {
  subMenuItems: {
    title: string
    navigationEndpoint: NavigationEndpoint
  }[]
}
