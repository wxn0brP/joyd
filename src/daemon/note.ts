import { broadcast } from "./client";

export function note(msg: string, ...args: any[]) {
    console.log(`\x1b[33m${msg}\x1b[0m`, ...args);
    broadcast(msg + " " + args.map((arg) => JSON.stringify(arg)).join(" "));
}
