"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ App Router용
import axios from "axios";

const API_URL = "http://localhost:3001"; // 백엔드 주소

const Page = () => {
  const router = useRouter(); // ✅ 훅은 컴포넌트 최상단에서 호출

  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { nickname, email, password, confirmPassword } = formData;

    if (!nickname || !email || !password || !confirmPassword) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await axios.post(`${API_URL}/auth/register`, {
        nickname,
        email,
        password,
      });

      alert("회원가입이 완료되었습니다!");
      await router.push("/login"); // ✅ 페이지 이동
    } catch (err: any) {
      console.error("회원가입 에러:", err);
      const message = err.response?.data?.message || "회원가입에 실패했습니다.";
      alert(message); // ✅ 백엔드에서 온 에러 메시지 그대로 alert
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nickname"
          placeholder="닉네임"
          value={formData.nickname}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="이메일"
          value={formData.email}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="비밀번호 확인"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
        >
          회원가입
        </button>
      </form>
    </div>
  );
};

export default Page;
