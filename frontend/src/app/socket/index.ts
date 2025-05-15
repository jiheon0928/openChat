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
  const token = localStorage.getItem("token");
  socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
    path: "/socket.io", // Nginx 설정에 맞춘 WS 경로
    transports: ["websocket"],
    auth: { token },
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  });
}

// SSR 시에도 타입 안전을 위해 빈 객체 캐스팅
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
