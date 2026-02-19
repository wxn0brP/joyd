#!/usr/bin/env bun

import { spawnSync } from "node:child_process";
import net from "node:net";
import { SOCKET_PATH } from "../shared";

const cmd = process.argv[2];

if (!cmd) {
    console.log(`Usage: joyd`);
    console.log(` stop|start|restart|status - systemctl`);
    console.log(` register - register service`);
    console.log(` logs - journalctl`);
    console.log(` watch|watch-logs|ping - ctl`);
    process.exit(1);
}

if (["start", "stop", "restart", "status"].includes(cmd)) {
    const args = `systemctl --user ${cmd} wxn0brp-joyd.service`;
    spawnSync(args, {
        shell: true,
        stdio: "inherit"
    });
    process.exit(0);
}

if (cmd === "logs") {
    spawnSync("journalctl --user -u wxn0brp-joyd -f", {
        shell: true,
        stdio: "inherit"
    });
    process.exit(0);
}

if (cmd === "register") {
    await import("./register");
    process.exit(0);
}

const client = net.createConnection(SOCKET_PATH);

client.on("connect", () => {
    switch (cmd) {
        case "watch-logs":
        case "watch":
            client.write(JSON.stringify({ action: "watch" }) + "\n");
            break;

        case "ping":
            client.write(JSON.stringify({ action: "ping" }) + "\n");
            break;

        case "axis":
            client.write(JSON.stringify({ action: "axis", x: +process.argv[3], y: +process.argv[4] }) + "\n");
            break;

        default:
            console.log("Usage: ctl watch|ping");
            process.exit(1);
    }
});

let buffer = "";

client.on("data", (chunk) => {
    buffer += chunk.toString();

    let index: number;
    while ((index = buffer.indexOf("\n")) !== -1) {
        const raw = buffer.slice(0, index);
        buffer = buffer.slice(index + 1);

        try {
            const parsed = JSON.parse(raw);
            if (cmd === "watch") {
                if (raw.includes("|")) {
                    console.clear();
                } else continue;
            }
            console.log(parsed);
        } catch { }
    }
});

client.on("error", (err) => {
    console.error("Connection error:", err);
});
