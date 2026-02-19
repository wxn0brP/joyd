import { join } from "path";

const RUNTIME_DIR = process.env.XDG_RUNTIME_DIR;
if (!RUNTIME_DIR) {
    console.error("XDG_RUNTIME_DIR is not defined");
    process.exit(1);
}

export const SOCKET_PATH = join(RUNTIME_DIR, "wxn0brp-joyd.sock");
