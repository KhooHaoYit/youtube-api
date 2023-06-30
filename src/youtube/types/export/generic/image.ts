export type Image = {
  thumbnails: [
    {
      url: string
    },
    ...unknown[]
  ]
  accessibility?: {
    accessibilityData: {
      /**
       * `あーね`
       */
      label: string
    }
  }
};

export function getUrl(image: Image) {
  return image.thumbnails[0].url
    .replace(/^\/\//, 'https://')
    .replace(/=[^]*$/, '=s0');
}

export function getName(image: Image) {
  return image.accessibility
    ?.accessibilityData.label;
}
