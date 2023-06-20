
import { YoutubeApi } from "../../api";
import { mkdir, stat, writeFile } from "fs/promises";
import { dirname } from "path";

const api = new YoutubeApi;
const info = [
  // have membership // no banner
  ['AkaiHaato/about', '/channel/UC1CfXB_kRs3C-zaeTG3oGyg/about'],
  // have membership // is verified
  ['hololive/about', '/channel/UCJFZiqLMntJufDCHc6bQixg/about'],
  // have membership // is artist
  ['HoshimachiSuisei/about', '/channel/UC5CwaMl1eIgY8h02uZw7u8A/about'],
  // not sub-able
  ['HoshimachiSuisei-Topic/about', '/channel/UCrzT1p8gn0hQTBeMA6e2YiA/about'],


  ['hololive/videos', '/channel/UCJFZiqLMntJufDCHc6bQixg/videos'],
  ['hololive/shorts', '/channel/UCJFZiqLMntJufDCHc6bQixg/shorts'],
  ['hololive/streams', '/channel/UCJFZiqLMntJufDCHc6bQixg/streams'],
  ['hololive/podcasts', '/channel/UCJFZiqLMntJufDCHc6bQixg/podcasts'],
  ['hololive/playlists', '/channel/UCJFZiqLMntJufDCHc6bQixg/playlists'],
  ['hololive/community', '/channel/UCJFZiqLMntJufDCHc6bQixg/community'],
  ['hololive/channels', '/channel/UCJFZiqLMntJufDCHc6bQixg/channels'], // ?view=59&flow=grid
  ['hololive/channels/subscriptions', '/channel/UCJFZiqLMntJufDCHc6bQixg/channels?view=56&shelf_id=0'],
  ['hololive/channels/custom-12', '/channel/UCJFZiqLMntJufDCHc6bQixg/channels?view=49&shelf_id=12'],
  ['hololive/about', '/channel/UCJFZiqLMntJufDCHc6bQixg/about'],

  ['HoshimachiSuisei/releases', '/channel/UC5CwaMl1eIgY8h02uZw7u8A/releases'],

  ['AkaiHaato/playlists', '/channel/UC1CfXB_kRs3C-zaeTG3oGyg/playlists'],

  ['AkaiHaato/_videos/KpCH4mbj_pk', '/watch?v=KpCH4mbj_pk'],

  ['manae_nme/about', '/channel/UCAPdxmEjYxUdQMf_JaQRl1Q/about'],

  ['Anko_Kisaki/channels', '/channel/UChXm-xAYPfygrbyLo2yCASQ/channels'],
  ['manae_nme/channels', '/channel/UCAPdxmEjYxUdQMf_JaQRl1Q/channels'],

  ['manae_nme/featured', '/channel/UCAPdxmEjYxUdQMf_JaQRl1Q/featured'],
  ['AkaiHaato/featured', '/channel/UC1CfXB_kRs3C-zaeTG3oGyg/featured'],
  ['AlettaSky/featured', '/channel/UC0lSxKAt9osiA29vnk1R4sg/featured'],
  ['MiryuKotofuji/featured', '/channel/UC58Ng5nTN3aiVveus4DEEDg/featured'],
  ['fuurayuri/featured', '/channel/UCUC1EIq0MtF-kctHPtQzIjQ/featured'],

  ['MapleAlcesiaCh/_videos/XmxZoBLzSSw', '/watch?v=XmxZoBLzSSw'],

  ['UruhaRushia/_videos/__jmEGM8W4E', '/watch?v=__jmEGM8W4E'],
  ['unknown/_videos/_', '/watch?v=_'],
  ['unknown/_videos/M71AXLRXj2Y', '/watch?v=M71AXLRXj2Y'],
  ['unknown/_videos/XkdYV5a1Lc8', '/watch?v=XkdYV5a1Lc8'],
  ['unknown/_videos/2hpzVbErUc4', '/watch?v=2hpzVbErUc4'],
  ['unknown/_videos/nLosl3Ry1fg', '/watch?v=nLosl3Ry1fg'],
  ['unknown/_videos/vXpvaAwiy4k', '/watch?v=vXpvaAwiy4k'],
  ['unknown/_videos/wXXKzPqDzYA', '/watch?v=wXXKzPqDzYA'],
  ['unknown/_videos/aC7Dh1SMbcQ', '/watch?v=aC7Dh1SMbcQ'],
  ['unknown/_videos/6qPBafETC7w', '/watch?v=6qPBafETC7w'],
  ['AkaiHaato/_videos/rRneIzh5C54', '/watch?v=rRneIzh5C54'],

  ['fuurayuri/about', '/channel/UCUC1EIq0MtF-kctHPtQzIjQ/about'],

  ['AsahinaAkane/community', '/channel/UCe_p3YEuYJb8Np0Ip9dk-FQ/community'],
  ['AmrzsMonstar/community', '/channel/UCULLc5b5rzDNp9K-rtF8W5w/community'],
  ['ManoAloe/community', '/channel/UCgZuwn-O7Szh9cAgHqJ6vjw/community'],

  ['ManoAloe/about', '/channel/UCgZuwn-O7Szh9cAgHqJ6vjw/about'],
  ['ManoAloe/playlists', '/channel/UCgZuwn-O7Szh9cAgHqJ6vjw/playlists'],
  ['KMNZ/channels', '/channel/UC68J5pWEshmwhDH45qnpIsg/channels'],
  ['UruhaRushia/featured', '/channel/UCl_gCybOJRIgOXw6Qb4qJzQ/featured'],

  ['AlettaSky/community', '/channel/UC0lSxKAt9osiA29vnk1R4sg/community'],
  ['AlettaSky/community_0', '/channel/UC0lSxKAt9osiA29vnk1R4sg/community?lb=Ugkxt8KCbEuMva9F2LMEqvaJQu2BX6GUHuk5'],
  ['GundoMirei/community', '/channel/UCeShTCVgZyq2lsBW9QwIJcw/community?lb=Ugkxic0xZ1SQLUOjyNAkIzWWWz3PWHW02VSE'],
];

(async () => {
  for (const [filename, urlPath] of info) {
    const path = `${__dirname}/../data/${filename}.ts`;

    if (
      await stat(path)
        .then(() => true)
        .catch(() => false)
    ) continue;
    await mkdir(dirname(path), { recursive: true });

    const {
      ytInitialData,
      ytInitialPlayerResponse,
    } = await api.scrapeYoutubePage(`https://www.youtube.com${urlPath}`);
    await writeFile(
      path,
      `
export type Data = ${JSON.stringify(ytInitialData, null, 2)};
export type PlayerResponse = ${JSON.stringify(ytInitialPlayerResponse, null, 2)};
`,
    );
    await writeFile(
      path.replace(/\.ts$/, '.json.ts'),
      `
export const Data = ${JSON.stringify(ytInitialData, null, 2)};
export const PlayerResponse = ${JSON.stringify(ytInitialPlayerResponse, null, 2)};
`,
    );
  }
})();
