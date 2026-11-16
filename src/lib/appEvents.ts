// Window events that let any screen open the header's Help panel or menu.
export const OPEN_HELP_EVENT = "nepsis:open-help";
export const OPEN_MENU_EVENT = "nepsis:open-menu";

export function openHelpPanel() {
  window.dispatchEvent(new Event(OPEN_HELP_EVENT));
}

export function openAppMenu() {
  window.dispatchEvent(new Event(OPEN_MENU_EVENT));
}

/** Link state that opens the app without the setup screens, for "Back to app" on the public pages. */
export const LOOK_AROUND_STATE = { lookAround: true } as const;
