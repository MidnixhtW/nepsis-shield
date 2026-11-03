// Window events that let any screen open the header's Help panel or menu.
export const OPEN_HELP_EVENT = "nepsis:open-help";
export const OPEN_MENU_EVENT = "nepsis:open-menu";

export function openHelpPanel() {
  window.dispatchEvent(new Event(OPEN_HELP_EVENT));
}

export function openAppMenu() {
  window.dispatchEvent(new Event(OPEN_MENU_EVENT));
}
