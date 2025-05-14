"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

// axios 인스턴스: Vercel rewrites로 /api → EC2 백엔드로 프록시
const api = axios.create({
  baseURL: "/api",
});

interface LoginResponse {
  statusCode: number;
  message: string;
  data: {
    status: string;
    message: string;
    token: {
      token: string;
      user: { id: number; nickname: string };
    };
  };
}

const Page = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = formData;
    if (!email || !password) {
      alert("이메일과 비밀번호를 모두 입력해.");
      return;
    }

    try {
      const res = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });
      console.log("로그인 응답 전체:", res.data);

      // 실제 토큰과 유저 정보 꺼내기
      const jwt = res.data.data.token.token;
      const { id, nickname } = res.data.data.token.user;

      if (!jwt) {
        alert("로그인 응답에 토큰이 없어.");
        return;
      }

      // 로컬스토리지에 저장
      localStorage.setItem("token", jwt);
      localStorage.setItem("userId", String(id));
      localStorage.setItem("nickname", nickname);

      alert("로그인 성공!");
      router.push("/chat");
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      const msg = error.response?.data?.message || "로그인에 실패했어.";
      alert(msg);
      console.error("로그인 에러:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <button
          type="submit"
          className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
        >
          로그인
        </button>
      </form>
    </div>
  );
};

export default Page;
