import net from "node:net";
import { handleAxis } from "./axis";
import { Client, send } from "./client";
import { menu } from "./commands";
import { startNode, stopNode } from "./node";
import { renderMenu } from "./render";

const start = new Date();

export async function handleMessage(msg: any, client: Client, socket: net.Socket) {
    switch (msg.action || msg.t) { // t like type
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

        case "node-start":
            startNode();
            send(socket, { error: false });
            socket.end();
            break;

        case "node-stop":
            stopNode();
            send(socket, { error: false });
            socket.end();
            break;

        case "axis":
            handleAxis(msg.x, msg.y);
            break;

        default:
            send(socket, { status: "error" });
    }
}
