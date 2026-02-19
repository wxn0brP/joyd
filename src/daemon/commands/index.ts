import { $ } from "bun";
import { spawn } from "node:child_process";
import { emitter } from "../event";
import { Command, MenuState } from "../types";
import { commands } from "./list";
import { handlePredefined } from "./pre";

export const menu: MenuState = {
    name: "start",
    data: commands.start
}

function startMenu() {
    menu.name = "start";
    menu.data = commands.start;
    emitter.emit("menu_changed", menu);
}

let goTimeOut: NodeJS.Timeout;

export async function handleCommand(cmd: Command) {
    switch (cmd.type) {
        case "execute":
            const ref = spawn(`${cmd.command}`, {
                shell: true
            });
            ref.unref();
            startMenu();
            break;
        case "go":
            menu.name = cmd.to;
            menu.data = commands[cmd.to];
            emitter.emit("menu_changed", menu);
            clearTimeout(goTimeOut);

            // reset the menu after 5s without activity
            goTimeOut = setTimeout(() => {
                if (menu.name !== "start") startMenu();
            }, 5000);

            break;
        case "openUrl":
            await $`xdg-open ${cmd.url}`;
            startMenu();
            break;
        case "pre":
            handlePredefined(cmd);
            startMenu();
            break;
    }
}
