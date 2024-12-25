export type MetadataBadgeRenderer = {
  metadataBadgeRenderer: {
    icon?: {
      /**
       * `AUDIO_BADGE` | haveArtistBadge
       * `CHECK_CIRCLE_THICK` | isVerified
       */
      iconType: string
    }
    label?: string
  }
};
