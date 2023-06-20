export type Runs = {
  text: string,
  navigationEndpoint?: {
    urlEndpoint?: {
      url: string,
    },
    "browseEndpoint"?: {
      "browseId": string,
    }
    [key: string]: unknown,
  },
}[];

export function getOriginalText(runs: Runs) {
  return runs.map(run => {
    const url = run.navigationEndpoint?.urlEndpoint?.url;
    if (url) {
      const urlObj = new URL(url);
      return urlObj.origin === 'https://www.youtube.com' && urlObj.pathname === '/redirect'
        ? urlObj.searchParams.get('q')
        : url;
    }
    return run.text;
  }).join('');
}
