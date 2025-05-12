// socket.ts
import { io } from "socket.io-client";

// 상대경로로 기본 origin 사용하도록 수정
const socket = io({
  withCredentials: true,
});

export default socket;
