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
  commandMetadata?: {
    webCommandMetadata: {
      /**
       * `/playlist?list=PLiniJMqFuOJ5Abuuomzy10K4UyZKw-6l0`
       * `/@AlettaSky/playlists?view=50&sort=dd&shelf_id=6`
       */
      url: string
    }
  }
  [key: string]: unknown
}
