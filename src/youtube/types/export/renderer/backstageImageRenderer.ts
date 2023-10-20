import { getUrl, Image } from "../generic/image";

export type BackstageImageRenderer = {
  image: Image
};

export function getImageUrl(renderer: BackstageImageRenderer) {
  return getUrl(renderer.image);
}
