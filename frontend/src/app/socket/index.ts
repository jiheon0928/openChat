// src/app/socket/index.ts

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

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

if (typeof window !== "undefined") {
  const token = localStorage.getItem("token"); // accessToken → token
  socket = io("/", {
    // window.location.origin 대신 "/"
    path: "/api/socket.io",
    auth: { token },
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  });
}

// 서버 사이드 렌더링 시에도 타입 안정성 유지
const safeSocket = (socket ?? {}) as Socket<
  ServerToClientEvents,
  ClientToServerEvents
>;

export function sendMessage(
  data: { userId: number; nickname: string; content: string },
  callback: (response: { success: boolean; message?: string }) => void
) {
  safeSocket.emit("sendMessage", data, callback);
}

export default safeSocket;
