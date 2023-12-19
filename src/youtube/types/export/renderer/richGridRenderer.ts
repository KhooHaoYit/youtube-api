export type RichGridRenderer<
  T extends {
    content: unknown
    header?: unknown
  }
> = {
  contents: T['content'][]
  header?: T['header']
};
