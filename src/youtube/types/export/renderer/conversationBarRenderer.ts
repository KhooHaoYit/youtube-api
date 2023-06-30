import { Runs } from "../generic/runs";
import * as runs from "../generic/runs";

export type ConversationBarRenderer = {
  availabilityMessage: {
    "messageRenderer": {
      "text": {
        /**
         * `Live chat replay is not available for this video.`
         * 
         * `Live chat replay was turned off for this video.`
         */
        "runs": Runs
      },
    }
  }
};

export function getUnavailabilityMessage(data: ConversationBarRenderer) {
  return runs.getOriginalText(data.availabilityMessage.messageRenderer.text.runs);
}
