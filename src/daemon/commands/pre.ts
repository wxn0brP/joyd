import { exec, execSync } from "node:child_process";
import { CommandPredefined } from "../types";

function getScreen() {
    const current = +execSync("qdbus org.kde.KWin /KWin currentDesktop").toString().trim();
    const raw = execSync(
        "qdbus --literal org.kde.KWin /VirtualDesktopManager org.kde.KWin.VirtualDesktopManager.desktops").toString().trim();
    const count = (raw.match(/\(uss\)/g) || []).length - 1;
    return [current, count];
}

async function screen(type: "next" | "prev") {
    const [current, count] = getScreen();
    let index = current;

    if (type === "next") {
        index = current + 1;
        if (index > count) index = 1;
    } else if (type === "prev") {
        index = current - 1;
        if (index < 1) index = count;
    }

    execSync(`qdbus org.kde.KWin /KWin setCurrentDesktop ${index}`);
}

export async function handlePredefined(cmd: CommandPredefined) {
    const { url, body } = cmd;
    if (url === "media/play-pause") exec(`playerctl play-pause`);
    else if (url === "media/next") exec(`playerctl next`);
    else if (url === "media/prev") exec(`playerctl previous`);
    else if (url === "screen/next") screen("next");
    else if (url === "screen/prev") screen("prev");
}
