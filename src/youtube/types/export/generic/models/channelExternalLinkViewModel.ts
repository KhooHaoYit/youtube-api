export type ChannelExternalLinkViewModel = {
  title: {
    content: string
  }
  link: {
    content: string
  }
  favicon?: {
    sources: {
      url: string
    }[]
  }
}

export type Link = [title: string, iconUrl: string | null, url: string | null];
export function getLinkInfo(data: ChannelExternalLinkViewModel): Link {
  return [
    data.title.content,
    data.favicon?.sources.at(-1)?.url ?? null,
    'https://' + data.link.content,
  ]
}
