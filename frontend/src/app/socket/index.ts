// src/socket.ts

import { io, Socket } from "socket.io-client";

interface ServerToClientEvents {
  message: (msg: string) => void;
  // 서버에서 받는 이벤트 타입들 추가
}

interface ClientToServerEvents {
  sendMessage: (msg: string) => void;
  // 클라이언트에서 보내는 이벤트 타입들 추가
}

let socket: Socket<ServerToClientEvents, ClientToServerEvents>;

/**
 * 소켓 생성 함수
 */
export function initSocket(): Socket<
  ServerToClientEvents,
  ClientToServerEvents
> {
  if (socket && socket.connected) {
    return socket;
  }

  const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3000";

  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  socket = io(WS_URL, {
    auth: { token },
    transports: ["websocket"],
    withCredentials: false, // 쿠키 사용 안 함
    path: "/socket.io", // 기본값이지만 명시해도 OK
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

  // 연결 실패
  socket.on("connect_error", (err) => {
    console.error("[Socket] connection error:", err);
  });

  // 끊어졌을 때
  socket.on("disconnect", (reason) => {
    console.warn("[Socket] disconnected:", reason);
  });

  // 서버에서 보내는 메시지 처리 (예시)
  socket.on("message", (msg) => {
    console.log("[Socket] message:", msg);
  });

  return socket;
}

/**
 * 메시지 전송 예시
 */
export function sendMessage(msg: string) {
  if (!socket) initSocket();
  socket.emit("sendMessage", msg);
}
