import { MessageRenderer, getMessageInfo } from "./messageRenderer";

export type ConversationBarRenderer = {
  availabilityMessage: {
    /**
     * `Live chat replay is not available for this video.`
     * 
     * `Live chat replay was turned off for this video.`
     */
    messageRenderer: MessageRenderer
  }
};

export function getUnavailabilityMessage(data: ConversationBarRenderer) {
  return getMessageInfo(data.availabilityMessage.messageRenderer)
    .content;
}
