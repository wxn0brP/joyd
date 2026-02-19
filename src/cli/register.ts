import { $ } from "bun";
import { existsSync, mkdirSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

const dir = join(homedir(), ".config", "systemd", "user");

if (!existsSync(dir))
    mkdirSync(dir, { recursive: true });

const file = join(dir, "wxn0brp-joyd.service");

const bunPath = await $`which bun`.text();
const daemonPath = join(__dirname, "..", "daemon", "index.ts");

await writeFile(
    file,
    `[Unit]
Description=wxn0brp-joyd
After=default.target

[Service]
ExecStart=${bunPath} run ${daemonPath}
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=default.target
`
);

console.log(`Service registered at ${file}`);

await $`systemctl --user daemon-reload`;

console.log(`Service reloaded`);
