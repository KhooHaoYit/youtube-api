import { PlayerResponse as ps0 } from '../data/unknown/_videos/2hpzVbErUc4.json';
import { PlayerResponse as ps1 } from '../data/unknown/_videos/M71AXLRXj2Y.json';
import { PlayerResponse as ps2 } from '../data/unknown/_videos/XkdYV5a1Lc8.json';
import { PlayerResponse as ps3 } from '../data/unknown/_videos/_.json';
import { PlayerResponse as ps4 } from '../data/unknown/_videos/aC7Dh1SMbcQ.json';
import { PlayerResponse as ps5 } from '../data/unknown/_videos/nLosl3Ry1fg.json';
import { PlayerResponse as ps6 } from '../data/unknown/_videos/vXpvaAwiy4k.json';
import { PlayerResponse as ps7 } from '../data/unknown/_videos/wXXKzPqDzYA.json';
import { PlayerResponse as ps8 } from '../data/UruhaRushia/_videos/__jmEGM8W4E.json';
import { PlayerResponse as ps9 } from '../data/MapleAlcesiaCh/_videos/XmxZoBLzSSw.json';
import { PlayerResponse as ps10 } from '../data/unknown/_videos/6qPBafETC7w.json';
import { VideoPlayerResponse } from '../export/video';
import { extractErrorMessage } from '../../helper';

const data = [
  ps0,
  ps1,
  ps2,
  ps3,
  ps4,
  ps5,
  ps6,
  ps7,
  ps8,
  ps9,
  ps10,
] as VideoPlayerResponse[];

const result = data
  .map(data => extractErrorMessage(data))
  .map((text, index) => [index, text]);

console.log(result);
