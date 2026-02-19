import net from "node:net";
import { Client, send } from "./client";
import { handleAxis } from "./axis";
import { renderMenu } from "./render";
import { menu } from "./commands";

const start = new Date();

export async function handleMessage(msg: any, client: Client, socket: net.Socket) {
    switch (msg.action) {
        case "ping":
            send(socket, {
                error: false,
                reply: "pong",
                time: start.toLocaleString()
            });
            break;

        case "watch":
            client.watching = true;
            renderMenu(menu);
            break;

        case "shutdown":
            process.exit(0);

        case "axis":
            handleAxis(msg.x, msg.y);
            break;

        default:
            send(socket, { status: "error" });
    }
}
