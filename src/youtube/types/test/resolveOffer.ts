import { Data as o0 } from '../data/.getOffer/UC1CfXB_kRs3C-zaeTG3oGyg.json';
import { Data as o1 } from '../data/.getOffer/UC5CwaMl1eIgY8h02uZw7u8A.json';
import { Data as o2 } from '../data/.getOffer/UCHsx4Hqa-1ORjQTh9TYDhww.json';
import { Data as o3 } from '../data/.getOffer/UC1DCedRgGHBdm81E1llLhOQ.json';
import { Data as o4 } from '../data/.getOffer/UCR6qhsLpn62WVxCBK1dkLow.json';

import { start } from "repl";
import { getOfferInfo } from '../export/renderer/sponsorshipsOfferRenderer';
import { getOffer } from '../export/endpoints/getOffer';
import { env } from '../../../env';


const offers = [
  o0,
  o1,
  o2,
  o3,
  o4,
].map((offer: any) => offer.actions[0].openPopupAction.popup.sponsorshipsOfferRenderer);

const repl = start();
repl.context.offers = offers;
repl.context.getOffer = getOffer;
repl.context.getOfferInfo = getOfferInfo;
repl.context.env = env;
