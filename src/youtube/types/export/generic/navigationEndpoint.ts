export type NavigationEndpoint = {
  browseEndpoint?: {
    /**
     * `UC1CfXB_kRs3C-zaeTG3oGyg`
     */
    browseId: string
    /**
     * `/@AkaiHaato`
     */
    canonicalBaseUrl?: string
  }
  watchEndpoint?: {
    /**
     * `KpCH4mbj_pk`
     */
    videoId: string,
  }
  urlEndpoint?: {
    url: string
  }
  [key: string]: unknown
}
