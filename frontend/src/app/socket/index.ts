// src/socket.ts
import { io, Socket } from "socket.io-client";

// Vercel 환경변수에서 불러온 백엔드 도메인 (HTTPS + WSS)
const API_URL = process.env.NEXT_PUBLIC_API_URL!; // e.g. "https://jiheonchat.duckdns.org"

const socket: Socket = io(API_URL, {
  path: "/socket.io",
  transports: ["websocket"], // 오직 WebSocket만 사용
  withCredentials: true, // 쿠키(토큰) 전송
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  autoConnect: true,
  forceNew: true,
});

socket.on("connect", () => {
  console.log("Socket connected successfully");
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
  if (!socket.connected) {
    console.log("Attempting to reconnect...");
    setTimeout(() => socket.connect(), 1000);
  }
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason);
  if (reason === "io server disconnect") {
    setTimeout(() => socket.connect(), 1000);
  }
});

socket.on("receiveMessage", (data) => {
  console.log("Received message:", data);
});

export default socket;
