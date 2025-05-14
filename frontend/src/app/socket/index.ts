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

// env가 없으면 로컬 테스트용 ws://localhost:3000 사용
const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:3000";

const token =
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(WS_URL!, {
  auth: { token },
  transports: ["websocket"],
  withCredentials: false,
  path: "/socket.io",
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
});

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
