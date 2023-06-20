export type EndScreenVideoRenderer = {
  "videoId": string,
  "title": {
    /**
     * `食える飯が作りたい。~第2話~【はあちゃまクッキング・改】`
     */
    "simpleText": string
  },
  "shortBylineText": {
    "runs": [
      {
        /**
         * `HAACHAMA Ch 赤井はあと`
         */
        "text": string,
        "navigationEndpoint": {
          "browseEndpoint": {
            /**
             * `UC1CfXB_kRs3C-zaeTG3oGyg`
             */
            "browseId": string,
            /**
             * `/@AkaiHaato`
             */
            "canonicalBaseUrl": string
          }
        }
      }
    ]
  },
  "lengthInSeconds": number,
  "shortViewCountText": {
    /**
     * `128K views`
     */
    "simpleText": string,
  },
  "publishedTimeText": {
    /**
     * `6 months ago`
     */
    "simpleText": string
  },
};
