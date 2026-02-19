import VEE from "@wxn0brp/event-emitter";
import { menu } from "./commands";
import { renderMenu } from "./render";
import { MenuState } from "./types";

export const emitter = new VEE<{
    menu_changed: (menu: MenuState) => void;
}>();

emitter.on("menu_changed", () => renderMenu(menu));
