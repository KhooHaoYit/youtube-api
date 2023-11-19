import { request } from "undici";
import { Credentials } from "../generic/credentials";
import { ResponseContext } from "../generic/responseContext";
import { SponsorshipsOfferRenderer } from "../renderer/sponsorshipsOfferRenderer";
import { YpcTransactionErrorMessageRenderer } from "../renderer/ypcTransactionErrorMessageRenderer";

export async function getOffer(
  options: {
    channelId?: string,
    itemParams?: string,
  },
  credential: Credentials,
) {
  const itemParams = options.itemParams
    // Assuming channelId is always 0x18 long
    // https://github.com/pawitp/protobuf-decoder
    ?? Buffer.from(`\n\x1C\b\x03\x12\x18${options.channelId}\x18\x03*\x04\x18\x01H\x01`) // from 'binary'??
      .toString('base64url');
  if (!itemParams)
    throw new Error(`itemParams is not defined`);
  return await request("https://www.youtube.com/youtubei/v1/ypc/get_offers", {
    method: 'POST',
    headers: {
      ...credential,
      'accept-language': 'en',
      'origin': 'https://www.youtube.com',
    },
    body: JSON.stringify({
      itemParams,
      context: {
        client: {
          clientName: "WEB",
          clientVersion: "2.20230831.09.00",
        },
      },
    }),
  }).then(res => <Promise<GetOffer>>res.body.json());
}

export type GetOffer = Partial<
  & {
    responseContext: ResponseContext
    actions: [
      {
        openPopupAction: {
          popup: {
            ypcTransactionErrorMessageRenderer?: YpcTransactionErrorMessageRenderer
            sponsorshipsOfferRenderer?: SponsorshipsOfferRenderer
          }
        }
      }
    ]
  }
  & {
    error: {
      code: number
      message: string
      errors: {
        message: string
        domain: string
        reason: string
      }[]
      status: string
    }
  }
>;
