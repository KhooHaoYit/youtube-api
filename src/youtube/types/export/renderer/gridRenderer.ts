export type GridRenderer<T extends any> = {
  items?: T extends [...unknown[]] ? T : [T, ...T[]],
};
