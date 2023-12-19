export type FeedFilterChipBarRenderer<
  T extends {
    content: unknown
  }
> = {
  contents: T['content'][]
}
