import { handleCommand, menu } from "./commands";
import { note } from "./note";

let blocked = false;

function deadZone(cord: number) {
    return cord >= 2 && cord <= 6;
}

function handle(index: number) {
    note("handle", index);
    handleCommand(menu.data[index]);
}

let timeout: NodeJS.Timeout;

export function handleAxis(x: number, y: number) {
    const xDead = deadZone(x);
    const yDead = deadZone(y);

    if (xDead && yDead) {
        clearTimeout(timeout);
        timeout = setTimeout(() => blocked = false, 100);
        return note("dead zone");
    }

    if (blocked) return note("blocked");
    blocked = true;

    // top
    if (y < 3 && xDead) return handle(0);

    // right
    if (x > 5 && yDead) return handle(1);

    // bottom
    if (y > 5 && xDead) return handle(2);

    // left
    if (x < 3 && yDead) return handle(3);

    note("axis", x, y);
}
