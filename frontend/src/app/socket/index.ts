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
}

// 안전하게 빈 소켓 구현
const safeSocket: any = socket || {
  on: () => {},
  emit: () => {},
  id: "",
};

export function sendMessage(
  data: { userId: number; nickname: string; content: string },
  callback: (response: { success: boolean; message?: string }) => void
) {
  safeSocket.emit("sendMessage", data, callback);
}

export default safeSocket as Socket<ServerToClientEvents, ClientToServerEvents>;
