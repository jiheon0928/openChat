// socket.ts
import { io } from "socket.io-client";

// 백엔드 서버 URL (3000 포트 사용)
const SOCKET_URL = "http://localhost:3000";

const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket"], // websocket만 사용
  reconnection: true,
  reconnectionAttempts: Infinity, // 무한 재시도
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  autoConnect: true,
  path: "/socket.io",
  timeout: 20000, // 타임아웃 시간 증가
  forceNew: true,
  extraHeaders: {
    "Access-Control-Allow-Origin": "*",
  },
});

// 연결 상태 모니터링
socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
  // 연결 실패 시 재연결 시도
  if (!socket.connected) {
    console.log("Attempting to reconnect...");
    setTimeout(() => {
      socket.connect();
    }, 1000);
  }
});

socket.on("connect", () => {
  console.log("Socket connected successfully");
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason);
  if (reason === "io server disconnect") {
    // 서버에서 연결을 끊은 경우 재연결 시도
    setTimeout(() => {
      socket.connect();
    }, 1000);
  }
});

// 메시지 수신 이벤트 리스너
socket.on("receiveMessage", (data) => {
  console.log("Received message:", data);
});

export default socket;
