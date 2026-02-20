// @ts-check
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import net from "node:net";
import path from "node:path";

const runtimeDir = process.env.XDG_RUNTIME_DIR;
if (!runtimeDir) throw new Error("XDG_RUNTIME_DIR not set");

const socketPath = path.join(runtimeDir, "wxn0brp-joyd.sock");

/** @type {SerialPort | null} */
let port;
/** @type {net.Socket | null} */
let socket = null;
/** @type {ReadlineParser | null} */
let parser;
let portBound = Number(process.env.JOYD_SERIAL_BAUD_RATE) || 9600;
let portPath = process.env.JOYD_SERIAL_PORT;

let lastLine = "";
let lastX = 0;
let lastY = 0;

if (!portPath) {
	// detect first /dev/ttyUSB*
	const portInfo = (await SerialPort.list())
		.find(p => p.path.startsWith("/dev/ttyUSB"));

	if (!portInfo) throw new Error("No ttyUSB device found");

	portPath = portInfo.path;
}

function createSerial(i = 0) {
	if (i > 25) {
		console.error("Serial port failed");
		process.exit(1);
	}

	if (port) {
		port.removeAllListeners();
		if (port.isOpen)
			port.close();
		port = null;
	}
	if (parser) {
		parser.removeAllListeners();
		parser = null;
	}

	port = new SerialPort({
		path: portPath,
		baudRate: portBound
	});

	port.on("error", (err) => {
		console.error("Serial error:", err);
		setTimeout(() => {
			createSerial(i + 1);
		}, 10_000);
	});

	port.on("open", () => {
		console.log("Serial port open");
		if (!port) return console.error("Serial port is null");

		parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

		parser.on("data", handleLine);
	});

	port.on("close", () => {
		console.log("Serial port closed");
		setTimeout(() => {
			createSerial(i + 1);
		}, 1000);
	});
}

function createSocket(i = 0) {
	if (i > 5) {
		console.error("Connection failed");
		process.exit(1);
	}

	if (socket) {
		socket.removeAllListeners();
		socket.destroy();
		socket = null;
		createSocket(0);
		return
	}

	socket = net.createConnection(socketPath);

	socket.on("error", (err) => {
		console.error("Connection error:", err);
	});

	socket.on("data", (data) => {
		console.log(data.toString());
	});

	socket.on("close", () => {
		console.error("Connection closed");
		setTimeout(() => createSocket(i + 1), 1000);
	});

	socket.on("connect", () => {
		console.log("Connected");
		if (!socket) return;
		writeToSocket({ action: "ping" });
	});
}

/** @param {any} payload */
function writeToSocket(payload) {
	if (!socket) return;
	socket.write(JSON.stringify(payload) + "\n");
}

/** @param {string} data */
function handleLine(data) {
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

		writeToSocket({ action: "axis", x, y });
	} catch (e) {
		console.error(e);
	}
}

setInterval(() => {
	writeToSocket({ action: "ping" });
}, 2 * 60 * 1000); // every 2 to keep connection alive

setInterval(() => {
	createSocket();
}, 15 * 60 * 1000); // every 15 reconnect

// setTimeout(createSocket, 2000);
createSocket();
createSerial();
