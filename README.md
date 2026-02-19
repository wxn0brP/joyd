# joyd

A joystick-based input daemon for Linux designed for radial / directional menus.
Reads analog input from Arduino and exposes it through a Unix socket.

## Requirements

- Arduino with analog joystick connected to pins A1 and A2
- [Bun](https://bun.sh/) runtime
- Linux with systemd (user services)

## Installation

```bash
bun install
bun run src/cli/register.ts
cd serial
bun install
cd ..
ln -s "$(pwd)/src/cli/index.ts" ~/.local/bin/joyd
```

User must be in the `dialout` group:

```sh
sudo usermod -aG dialout $USER
```

### Hardware

Using Arduino IDE or alternative upload sketch from `joystick/`

## Usage

### Start the daemon

```bash
joyd start
cd serial
# bun don't support `serialport` yet, then use `node`
node .
```

> Warning: The serial bridge (Node process) must be started separately, otherwise the daemon will do nothing.

### Serial configuration

The `serial/index.js` accepts optional environment variables:

- `SERIAL_PORT` - serial port path (e.g. `/dev/ttyUSB0`). If not set, auto-detects first `/dev/ttyUSB*` device.
- `SERIAL_BAUD_RATE` - baud rate (default: `9600`)

Example:

```bash
SERIAL_PORT=/dev/ttyUSB0 SERIAL_BAUD_RATE=115200 node .
```

### CLI commands

```bash
# Manage daemon (systemd user service)
joyd start|stop|restart|status

# Register the service
joyd register

# View logs (journalctl)
joyd logs

# Watch menu previews
joyd watch

# Ping the daemon
joyd ping
```

## Architecture

- **Arduino** (`joystick/`) - reads analog values from joystick axes (A1, A2), maps them to 0-9 range, outputs via serial at 9600 baud
- **Daemon** (`src/daemon/`) - background service that reads serial data and exposes it via Unix socket
- **CLI** (`src/cli/`) - control tool for managing the daemon and testing commands

## Socket Protocol

Connect to `$XDG_RUNTIME_DIR/wxn0brp-joyd.sock` and send JSON messages:

```json
{"action": "watch"}
{"action": "ping"}
{"action": "axis", "x": 5, "y": 3}
```

## License

MIT
