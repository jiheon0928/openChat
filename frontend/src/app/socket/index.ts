// src/socket.ts

import { io, Socket } from "socket.io-client";

interface ServerToClientEvents {
  message: (msg: string) => void;
  // 필요한 서버 이벤트 타입 추가
}

interface ClientToServerEvents {
  sendMessage: (msg: string) => void;
  // 필요한 클라이언트 이벤트 타입 추가
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:3000";
const token =
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

// 한 번만 생성되는 싱글톤 소켓
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(WS_URL, {
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

// 연결 성공
socket.on("connect", () => {
  console.log("[Socket] connected, id=", socket.id);
});

// 연결 에러
socket.on("connect_error", (err) => {
  console.error("[Socket] connection error:", err);
});

// 끊어졌을 때
socket.on("disconnect", (reason) => {
  console.warn("[Socket] disconnected:", reason);
});

// 서버 메시지 (예시)
socket.on("message", (msg) => {
  console.log("[Socket] message:", msg);
});

/**
 * 메시지 보내는 헬퍼
 */
export function sendMessage(msg: string) {
  socket.emit("sendMessage", msg);
}

export default socket;
