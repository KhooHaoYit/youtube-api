import { getUrl, Image } from "../generic/image";
import { Text } from "../generic/text";

export type PlayerMicroformatRenderer = {
  /**
   * might be undefined
   */
  "embed"?: {},
  /**
   * `https://i.ytimg.com/vi/ontzsSgjsb0/maxresdefault.jpg`
   * `https://i.ytimg.com/vi/ZZ5tP2hWo0M/maxres2.jpg?sqp=-oaymwEoCIAKENAF8quKqQMcGADwAQH4AZQDgALQBYoCDAgAEAEYZSBlKGUwDw==\u0026rs=AOn4CLB2G4-ahbPww0dNYWyaEPWNFH4RIg`
   */
  thumbnail: Image,
  /**
   * `【CORPSE PARTY #1】- they don't know i'm a corpse`
   */
  title: Text
  /**
   * not defined when user didn't set any description
   */
  /**
   * `サムネ絵/Thumbnail Art - https://twitter.com/kopiyeeee\n\n🍁🍂HOWDY! I'm Maple, a nature-walking, game-playing vtuber!🍂🍁\n\nIf you have a good time, please subscribe and follow me on Twitter!\n➳ YouTube: https://www.youtube.com/channel/UCYAf7WYj2PRG9XvBpf3DXPQ\n➳ Twitch: https://www.twitch.tv/maplealcesia\n➳ Twitter: https://twitter.com/MapleAlcesia\n➳ Discord: https://discord.gg/3gqshtwDMY\n➳ Marshmallow: https://marshmallow-qa.com/maplealcesia\n\n\n🍁🍂Tags For This Stream🍂🍁\n#Mooschief #CorpseParty #MapleAlcesia\n\n\n🍁🍂 RULES 🍂🍁\n➳ Please be kind and respectful to each other so we can have fun!\n➳ If you see anyone spamming or being mean please just block and report, don't engage!\n➳ Please no spoilers or backseating! If I need help I'll ask for it!\n➳ Please do not bring me up in anyone else's streams unless they bring me up!\n➳ Similarly, please try to stay on topic in my chat! No roleplaying, etc.\n➳ The following VTubers are okay to bring up, as I watch them and can have a convo about them:\n⚡🥐🍙👯🔥🏴‍☠️🐏👾♌🎪👿💀🐔🐙🔱🔎🏆 + any other mins kids and their genmates!\n➳ Please only talk about Maple and Mapley stuff in the waiting room!\n➳ I speak English and a little Japanese. You're welcome to speak any language, but I might not know how to respond!\n➳ HAVE FUN!!!\n\n\n🍁🍂Clipping Guidelines:🍂🍁\n🧡Clipping is OK!\n🧡Clipping within 24 hours is OK!\n🧡Translating my content is OK!\n🧡Monetizing clips of my content is OK!\n🧡Clipping my unarchived content is OK!\n🖤Please don't misrepresent anything I say or the context of clips!\n🖤Please do not upload clips of a stream while I'm still streaming it!\n\n\n🍁🍂Tags🍂🍁\n配信タグ Live Tag: #Mooschief\nArt: #Alcesiart\nファン名 Fan Name: Moosfits\n推しマーク Mark: 🍁🍂\n\n\n🍁🍂CREDITS🍂🍁\ndesign/model: https://twitter.com/minsgraph\nlive2D rig: https://twitter.com/megajujube\nopening maple animation: https://twitter.com/ShihoAnimator\nopening music: 夕日のロンド by MAKOOTO https://dova-s.jp/bgm/play10450.html\nbgm: Field by MFP【Marron Fields Production】https://dova-s.jp/bgm/play11529.html`
   */
  description?: Text
  /**
   * `8616`
   */
  "lengthSeconds": string,
  /**
   * `http://www.youtube.com/@MapleAlcesiaCh`
   */
  "ownerProfileUrl": string,
  /**
   * `UCYAf7WYj2PRG9XvBpf3DXPQ`
   */
  "externalChannelId": string,
  "isFamilySafe": boolean,
  "isUnlisted": boolean,
  "hasYpcMetadata": boolean,
  /**
   * `169`
   * not defined when viewing membership video without membership
   */
  "viewCount"?: string,
  /**
   * `Gaming`
   */
  "category": string,
  /**
   * `2021-10-27`
   */
  "publishDate": string,
  /**
   * `Maple Alcesia Ch.`
   */
  "ownerChannelName": string,
  "liveBroadcastDetails"?: {
    "isLiveNow": boolean,
    /**
     * `2021-10-26T23:01:09+00:00`
     */
    "startTimestamp": string,
    /**
     * `2021-10-27T01:25:09+00:00`
     */
    "endTimestamp": string
  },
  /**
   * `2021-10-27`
   */
  "uploadDate": string
};

export function getVideoId(data: PlayerMicroformatRenderer) {
  return getUrl(data.thumbnail)
    .replace(/^[^]+?vi\//, '')
    .replace(/\/[^]+$/, '');
}

export function getHandle(data: PlayerMicroformatRenderer) {
  return data.ownerProfileUrl
    .replace(/^[^@]*@/, '');
}
