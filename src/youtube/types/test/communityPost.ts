import { Data as c0 } from '../data/hololive/community.json';
import { Data as c1 } from '../data/AsahinaAkane/community.json';
import { Data as c2 } from '../data/AmrzsMonstar/community.json';
import { Data as c3 } from '../data/ManoAloe/community.json';
import { Data as c4 } from '../data/AlettaSky/community.json';
import { Data as c5 } from '../data/AlettaSky/community_0.json';
import { __dirnameFromImportMeta } from '../../../app.utils';
import { YoutubeApi } from '../../api';
import { writeFile } from 'fs/promises';
import { browseAll } from '../export/endpoints/browse';

const schema: Record<string, unknown[] | undefined> = {};
const addSchema = (data: Record<string, any>, key: string) => {
  if (!(key in data))
    return;
  (schema[key] ||= [])
    .push(data[key]);
}

[
  c0,
  c1,
  c2,
  c3,
  c4,
  c5,
].forEach((data: any) => data
  .contents.twoColumnBrowseResultsRenderer.tabs
  .find((tab: any) => tab.tabRenderer?.title === 'Posts')
  .tabRenderer.content.sectionListRenderer.contents[0]
  .itemSectionRenderer.contents.forEach((content: any) => {
    if ('continuationItemRenderer' in content)
      return;
    if ('messageRenderer' in content)
      return console.log(content.messageRenderer.text);
    addSchema(content, 'backstagePostThreadRenderer');
    const post = content.backstagePostThreadRenderer.post;
    addSchema(post, 'backstagePostRenderer');
    addSchema(post, 'sharedPostRenderer');
  }));

(async () => {

  const api = new YoutubeApi;
  const {
    innertubeApiKey,
    ytInitialData,
  } = await api.scrape('/channel/UCkIimWZ9gBJRamKF0rmPU8w/community');
  if (!innertubeApiKey)
    throw new Error(`Channel does not exists`);
  for await (
    const item
    of browseAll(innertubeApiKey, (<any>ytInitialData).contents.twoColumnBrowseResultsRenderer.tabs
      .find((tab: any) => tab.tabRenderer?.title === 'Posts')
      .tabRenderer.content.sectionListRenderer.contents[0]
      .itemSectionRenderer.contents)
  ) {
    if ('messageRenderer' in item)
      continue;
    addSchema(item, 'backstagePostThreadRenderer');
    const post = item.backstagePostThreadRenderer.post;
    addSchema(post, 'backstagePostRenderer');
    addSchema(post, 'sharedPostRenderer');
  }

  // write files
  for (const [type, datas] of Object.entries(schema)) {
    const capitalized = type.replace(/./, c => c.toUpperCase());
    await writeFile(`${__dirname}/../test/${type}.ts`, `
import { ${capitalized} } from '../export/${type}';

const checker = <T extends ${capitalized}>(data: T) => void 0;

${datas!.map((data: any) => `
checker(${JSON.stringify(data, undefined, 2)});
`).join('\n')}
`);
  }
})();
