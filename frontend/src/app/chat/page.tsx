"use client";

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";

interface ChatMessage {
  id: number;
  senderId: number;
  nickname: string;
  content: string;
  createdAt: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const nickname = localStorage.getItem("nickname");
    if (!token || !userId || !nickname) {
      alert("로그인이 필요해.");
      return;
    }

    // 1) 기존 메시지 불러오기
    axios
      .get<{ data: ChatMessage[] }>(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/messages`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        if (Array.isArray(res.data.data)) {
          setMessages(res.data.data);
        }
      })
      .catch(console.error);

    // 2) 소켓 연결
    const socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
      path: "/socket.io",
      transports: ["websocket"],
      auth: { token },
    });
    socketRef.current = socket;

    socket.on("receiveMessage", (newMessage: ChatMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });
    socket.on("connect", () => console.log("소켓 연결됨"));
    socket.on("disconnect", () => console.log("소켓 해제됨"));
    socket.on("connect_error", (err) => console.error("소켓 에러:", err));

    return () => {
      socket.off("receiveMessage");
      socket.disconnect();
    };
  }, []);

  // 새 메시지마다 스크롤 맨 아래
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const nickname = localStorage.getItem("nickname");
    if (!token || !userId || !nickname) {
      alert("로그인이 필요해.");
      return;
    }
    if (!input.trim()) {
      alert("메시지를 입력해.");
      return;
    }

    socketRef.current?.emit(
      "sendMessage",
      { userId: Number(userId), nickname, content: input },
      (res: { success: boolean; message?: string }) => {
        if (!res.success) {
          alert(res.message || "전송 실패");
        }
      }
    );

    setInput("");
  };

  return (
    <div className="p-4">
      <div
        ref={chatContainerRef}
        className="flex flex-col gap-2 mb-4 max-h-[500px] overflow-y-auto border p-4 rounded"
      >
        {messages.map((msg) => {
          const myId = Number(localStorage.getItem("userId"));
          const isMe = msg.senderId === myId;
          return (
            <div
              key={`${msg.id}-${msg.createdAt}`}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-2 rounded-lg max-w-xs break-words ${
                  isMe
                    ? "bg-black text-white rounded-br-none"
                    : "bg-gray-300 text-black rounded-bl-none"
                }`}
              >
                <div className="text-sm font-semibold mb-1">
                  {isMe ? "나" : msg.nickname}
                </div>
                <div>{msg.content}</div>
                <div className="text-xs text-right mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2">
        <input
          className="border p-2 flex-1 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지 입력..."
        />
        <button
          className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          onClick={handleSend}
        >
          보내기
        </button>
      </div>
    </div>
  );
}
