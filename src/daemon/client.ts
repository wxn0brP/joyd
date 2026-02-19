import net from "node:net";

export interface Client {
    socket: net.Socket;
    watching: boolean;
};

export const clients = new Set<Client>();

export function send(socket: net.Socket, payload: unknown) {
    socket.write(JSON.stringify(payload) + "\n");
}

export function broadcast(payload: unknown) {
    clients.forEach((client) => {
        if (!client.watching) return;
        send(client.socket, payload);
    });
}
