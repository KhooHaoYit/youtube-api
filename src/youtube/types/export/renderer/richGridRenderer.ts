export type RichGridRenderer<T extends any> = {
  contents: T extends [...unknown[]] ? T : [T, ...T[]],
};
