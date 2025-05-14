// src/socket.ts

import { io, Socket } from "socket.io-client";

interface ServerToClientEvents {
  message: (msg: string) => void;
  receiveMessage: (newMessage: {
    id: number;
    senderId: number;
    nickname: string;
    content: string;
    createdAt: string;
  }) => void;
}

interface ClientToServerEvents {
  sendMessage: (
    data: { userId: number; nickname: string; content: string },
    callback: (response: { success: boolean; message?: string }) => void
  ) => void;
}

let socket: Socket<ServerToClientEvents, ClientToServerEvents>;

if (typeof window !== "undefined") {
  const token = localStorage.getItem("accessToken");
  socket = io(window.location.origin, {
    path: "/api/socket.io",
    auth: { token },
    transports: ["websocket"],
    withCredentials: false,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  });
} else {
  socket = {} as any;
}

socket.on("connect", () => {
  console.log("[Socket] connected, id=", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("[Socket] connection error:", err);
});

socket.on("disconnect", (reason) => {
  console.warn("[Socket] disconnected:", reason);
});

socket.on("message", (msg) => {
  console.log("[Socket] message:", msg);
});

export function sendMessage(
  data: { userId: number; nickname: string; content: string },
  callback: (response: { success: boolean; message?: string }) => void
) {
  socket.emit("sendMessage", data, callback);
}

export default socket;
