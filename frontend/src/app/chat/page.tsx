"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get<{ result: ChatMessage[] }>(
          "http://localhost:3001/chat/messages",
          { withCredentials: true }
        );
        setMessages(response.data.result || []);
      } catch (error) {
        console.error("📛 메세지 불러오기 실패:", error);
      }
    };

    fetchMessages();

    if (!socket.connected) {
      socket.connect();
    }

    const handleReceiveMessage = (data: ChatMessage) => {
      setMessages((prev) => [data, ...prev]);
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, []);

  const handleSend = () => {
    const userId = localStorage.getItem("userId");
    const nickname = localStorage.getItem("nickname");

    if (!userId || !nickname) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!input.trim()) {
      alert("메세지를 입력해주세요.");
      return;
    }

    socket.emit("sendMessage", {
      userId: Number(userId),
      nickname,
      content: input,
    });

    setInput("");
  };

  return (
    <div className="p-4">
      <div className="space-y-2 mb-4 max-h-[500px] overflow-y-auto border p-4 rounded">
        {Array.isArray(messages) &&
          messages.map((msg) => (
            <div
              key={`${msg.id}-${msg.createdAt}`}
              className="bg-gray-100 p-2 rounded">
              <div className="text-sm text-gray-600">
                {msg.nickname} ({msg.senderId})
              </div>
              <div className="text-base">{msg.content}</div>
              <div className="text-xs text-gray-400 text-right">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </div>
            </div>
          ))}
      </div>

      <div className="flex gap-2">
        <input
          className="border p-2 flex-1 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메세지 입력..."
        />
        <button
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          onClick={handleSend}>
          보내기
        </button>
      </div>
    </div>
  );
}
