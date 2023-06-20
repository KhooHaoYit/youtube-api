import { BackstageImageRenderer, getImageUrl } from "./backstageImageRenderer";

export type PostMultiImageRenderer = {
  images: {
    backstageImageRenderer: BackstageImageRenderer
  }[]
};

export function getAllImageUrls(data: PostMultiImageRenderer) {
  return data.images
    .map(image => getImageUrl(image.backstageImageRenderer));
}
