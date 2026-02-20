import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import net from "node:net";
import path from "node:path";

const runtimeDir = process.env.XDG_RUNTIME_DIR;
if (!runtimeDir) throw new Error("XDG_RUNTIME_DIR not set");

const socketPath = path.join(runtimeDir, "wxn0brp-joyd.sock");

/** @type {SerialPort} */
let port;
let portBound = +process.env.SERIAL_BAUD_RATE || 9600;
let portPath = process.env.SERIAL_PORT;

if (!portPath) {
	// detect first /dev/ttyUSB*
	const portInfo = (await SerialPort.list())
		.find(p => p.path.startsWith("/dev/ttyUSB"));

	if (!portInfo) throw new Error("No ttyUSB device found");

	portPath = portInfo.path;
}

port = new SerialPort({
	path: portPath,
	baudRate: portBound
});

const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

const socket = net.createConnection(socketPath);

socket.on("error", (err) => {
	console.error("Connection error:", err);
});

socket.on("data", (data) => {
	console.error(data.toString());
});

socket.on("close", () => {
	console.error("Connection closed");
	process.exit(1);
})

socket.write(JSON.stringify({ action: "ping" }) + "\n");

let lastLine = "";
let lastX = 0;
let lastY = 0;

parser.on("data", data => {
	/** @type {string} */
	const line = data.trim();
	if (line === lastLine) return;
	lastLine = line;

	try {
		let [x, y] = line
			.split(" ")
			.map(Number)
			.map(n => Math.min(n, 8)); // limit to 8

		if (x === lastX && y === lastY) return;
		lastX = x;
		lastY = y;

		// invert y (hardware is inverted)
		y = 8 - y;

		const json = JSON.stringify({ action: "axis", x, y });
		socket.write(json + "\n");
	} catch (e) {
		console.error(e);
	}
});

setInterval(() => {
	socket.write(JSON.stringify({ action: "ping" }) + "\n");
}, 2 * 60 * 1000); // every 2 minutes to keep connection alive
