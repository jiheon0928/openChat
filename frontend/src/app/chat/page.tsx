"use client";

import { useEffect, useState, useRef } from "react";
import socket from "../socket";
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

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log("메시지 불러오기 시작");
        const { data } = await axios.get<{ data: ChatMessage[] }>(
          `/api/chat/messages`,
          { withCredentials: true }
        );

        console.log("서버 응답:", data);

        if (data && Array.isArray(data.data)) {
          setMessages(data.data);
          console.log("메시지 설정 완료:", data.data);
        } else {
          console.error("서버 응답 형식이 올바르지 않습니다.", data);
        }
      } catch (error) {
        console.error("메시지 불러오기 실패:", error);
      }
    };

    fetchMessages();

    console.log("소켓 연결 상태:", socket.connected);
    if (!socket.connected) {
      console.log("소켓 연결 시도");
      socket.connect();
    }

    const handleReceiveMessage = (newMessage: ChatMessage) => {
      console.log("새 메시지 수신:", newMessage);
      setMessages((prev) => [...prev, newMessage]);
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("connect", () => console.log("소켓 연결됨"));
    socket.on("disconnect", () => console.log("소켓 연결 끊김"));
    socket.on("connect_error", (error) =>
      console.error("소켓 연결 에러:", error)
    );

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    const userId = localStorage.getItem("userId");
    const nickname = localStorage.getItem("nickname");

    console.log("메시지 전송 시도:", { userId, nickname, content: input });

    if (!userId || !nickname) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!input.trim()) {
      alert("메시지를 입력해주세요.");
      return;
    }

    socket.emit(
      "sendMessage",
      {
        userId: Number(userId),
        nickname,
        content: input,
      },
      (response: { success: boolean; message?: string }) => {
        console.log("메시지 전송 응답:", response);
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
          const myUserId = Number(localStorage.getItem("userId"));
          const isMyMessage = msg.senderId === myUserId;

          return (
            <div
              key={`${msg.id}-${msg.createdAt}`}
              className={`flex ${
                isMyMessage ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-2 rounded-lg max-w-xs break-words ${
                  isMyMessage
                    ? "bg-black text-white rounded-br-none"
                    : "bg-gray-300 text-black rounded-bl-none"
                }`}
              >
                <div className="text-sm font-semibold mb-1">
                  {isMyMessage ? "나" : msg.nickname}
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
