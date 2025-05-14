"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const Page = () => {
  const router = useRouter();

  // 리라이트 설정에 따라 기본 경로만 사용
  const API_BASE = "/api";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    const { email, password } = formData;
    if (!email || !password) {
      alert("이메일과 비밀번호를 모두 입력해줘.");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/auth/login`, {
        email,
        password,
      });

      // 백엔드에서 { token, user } 형태로 반환한다고 가정
      const { token, user } = res.data;
      if (!token) {
        alert("로그인 응답에 토큰이 없어.");
        console.error("응답 전체:", res.data);
        return;
      }

      // 로컬스토리지에 토큰 저장
      localStorage.setItem("token", token);
      alert("로그인 성공!");
      // 필요하면 전역 상태나 Context에 user 정보도 저장
      // 예: setUser(user);

      router.push("/chat");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message || "로그인에 실패했어.";
        alert(msg);
      } else {
        alert("알 수 없는 에러가 발생했어.");
      }
      console.error("로그인 에러:", err);
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
