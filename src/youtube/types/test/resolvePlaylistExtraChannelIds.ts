import { Data as d0 } from '../../types/data/videoWithPlaylists/OLAK5uy_kEU7UuXIh5K0HCoZoYDVII2OlnjHroh-s.json';
import { Data as d1 } from '../../types/data/videoWithPlaylists/OLAK5uy_mJMEUZbDpHyJGzH04FmTysJRSx6QoOmAI.json';
import { Data as d2 } from '../../types/data/videoWithPlaylists/PLwBnYkSZTLgLFk7bb4DChdrRvdWZQSA0Y.json';
import { Data as d3 } from '../../types/data/videoWithPlaylists/RDEMl96gT7U4I5wV18P5hVQpBg.json';

import { start } from "repl";
import { getPlaylistExtraChannelIds } from '../export/url/watch';


const data = [
  d0,
  d1,
  d2,
  d3,
];

const repl = start();
repl.context.data = data;
repl.context.getPlaylistExtraChannelIds = getPlaylistExtraChannelIds;
