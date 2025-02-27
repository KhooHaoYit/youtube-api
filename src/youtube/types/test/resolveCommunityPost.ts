import { Data as c0 } from '../data/hololive/community.json';
import { Data as c1 } from '../data/AsahinaAkane/community.json';
import { Data as c2 } from '../data/AmrzsMonstar/community.json';
import { Data as c3 } from '../data/ManoAloe/community.json';
import { Data as c4 } from '../data/AlettaSky/community.json';
import { Data as c5 } from '../data/AlettaSky/community_0.json';
import { Data as c6 } from '../data/GundoMirei/community_0.json';

import { start } from "repl";
import { getPost } from '../export/renderer/backstagePostThreadRenderer';


const posts = [
  c0,
  c1,
  c2,
  c3,
  c4,
  c5,
  c6,
].map((data: any) => data
  .contents.twoColumnBrowseResultsRenderer.tabs
  .find((tab: any) => tab.tabRenderer?.title === 'Posts')
  .tabRenderer.content.sectionListRenderer.contents[0]
  .itemSectionRenderer.contents.map((content: any) => {
    if ('continuationItemRenderer' in content)
      return;
    if ('messageRenderer' in content)
      return;
    return content.backstagePostThreadRenderer.post;
  })
  .filter((post: any) => post))
  .flat();

const repl = start();
repl.context.posts = posts;
repl.context.getPost = getPost;
