"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

// ① REST API는 `/api` rewrite 대신 환경변수로 직접 백엔드에 연결합니다.
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // e.g. "https://34.225.172.232"
});

interface RegisterResponse {
  status: string;
  message: string;
  data: unknown;
}

interface ErrorResponse {
  message: string;
}

const Page = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { nickname, email, password, confirmPassword } = formData;

    if (!nickname || !email || !password || !confirmPassword) {
      alert("모든 필드를 입력해.");
      return;
    }
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않아.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post<RegisterResponse>("/auth/register", {
        nickname,
        email,
        password,
      });

      alert(res.data.message); // 백엔드에서 보내준 메시지 ("등록 성공" 등)
      router.push("/login");
    } catch (err: unknown) {
      const error = err as AxiosError<ErrorResponse>;
      const msg = error.response?.data?.message || "회원가입에 실패했어.";
      alert(msg);
      console.error("회원가입 에러:", error);
    } finally {
      setLoading(false);
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
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading ? "bg-gray-300" : "bg-gray-500 hover:bg-gray-600"
          }`}
        >
          {loading ? "가입 중..." : "회원가입"}
        </button>
      </form>
    </div>
  );
};

export default Page;
