export type Image = {
  thumbnails: [
    {
      url: string
    },
    ...unknown[]
  ]
};

export function getUrl(image: Image) {
  return image.thumbnails[0].url
    .replace(/^\/\//, 'https://')
    .replace(/=[^]*$/, '=s0');
}
