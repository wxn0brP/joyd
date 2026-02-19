#!/usr/bin/env bun

import fs from "node:fs";
import net from "node:net";
import { SOCKET_PATH } from "../shared";
import { Client, clients, send } from "./client";
import { handleMessage } from "./msg";
import { note } from "./note";

if (fs.existsSync(SOCKET_PATH)) {
    fs.unlinkSync(SOCKET_PATH);
}

const server = net.createServer((socket) => {
    const client: Client = {
        socket,
        watching: false
    };
    clients.add(client);

    let buffer = "";

    socket.on("data", (chunk) => {
        buffer += chunk.toString();

        let index: number;
        while ((index = buffer.indexOf("\n")) !== -1) {
            const raw = buffer.slice(0, index);
            buffer = buffer.slice(index + 1);

            try {
                handleMessage(JSON.parse(raw), client, socket);
            } catch {
                send(socket, { status: "error", message: "Invalid JSON" });
            }
        }
    });

    socket.on("close", () => {
        clients.delete(client);
    });
});

server.listen(SOCKET_PATH, () => {
    fs.chmodSync(SOCKET_PATH, 0o600);
    console.log("Daemon started");
});

process.on("uncaughtException", (err) => {
    note("Uncaught exception:", err);
});

process.on("unhandledRejection", (err) => {
    note("Unhandled rejection:", err);
});
