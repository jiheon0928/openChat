import { io } from "socket.io-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const socket = io(API_URL, {
  withCredentials: true,
});

export default socket;
