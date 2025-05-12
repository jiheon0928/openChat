import { io } from "socket.io-client";

// pages 또는 app 폴더 어디에서든
const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const socket = io(API_URL, {
  withCredentials: true,
});

export default socket;
