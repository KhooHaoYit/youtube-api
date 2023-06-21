export type SectionListRenderer<
  T extends {
    content: unknown
    subMenu?: unknown
  }
> = {
  contents: T['content'] extends [...unknown[]]
  ? T['content']
  : [T['content'], ...T['content'][]],
  subMenu?: T['subMenu'],
};

export function getContents<T extends { content: unknown }>(data: SectionListRenderer<T>) {
  return data.contents;
}

export function getSubMenu<T extends { content: unknown }>(data: SectionListRenderer<T>) {
  return data.subMenu;
}
