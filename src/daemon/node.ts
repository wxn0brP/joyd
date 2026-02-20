import { join } from "node:path";
import { spawn } from "bun";
import { note } from "./note";

export let proc: Bun.Subprocess;

export function startNode() {
    if (proc)
        proc.kill();
    proc = spawn(["node", "."], {
        stdout: "inherit",
        stderr: "inherit",
        env: process.env,
        cwd: join(import.meta.dir, "..", "..", "serial")
    });
    note("node started");
}

export function stopNode() {
    if (!proc) return;
    proc.kill();
    proc = undefined;
    note("node stopped");
}
