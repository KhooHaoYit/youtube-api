export type ItemSectionRenderer<T extends any> = {
  contents: T extends [...unknown[]] ? T : [T, ...T[]],
};
