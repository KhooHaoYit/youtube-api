export type SectionListRenderer<T extends any> = {
  contents: T extends [...unknown[]] ? T : [T, ...T[]],
};
