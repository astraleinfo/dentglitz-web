import { sendGTMEvent } from "@next/third-parties/google";

export function trackButtonClick(buttonName: string) {
  sendGTMEvent({ event: "button_click", button_name: buttonName, page: window.location.pathname });
}
