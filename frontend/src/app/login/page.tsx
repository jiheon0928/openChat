"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const Page = () => {
  const router = useRouter();

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
      alert("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      // API_URL 대신 상대경로로 호출
      const response = await axios.post(
        `/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      const nickname = response.data.nickname;
      const id = response.data.id;

      if (!nickname || !id) {
        alert("로그인 응답에 문제가 있습니다.");
        console.error("로그인 응답:", response.data);
        return;
      }

      localStorage.setItem("nickname", nickname);
      localStorage.setItem("userId", id.toString());
      console.log("로그인 응답:", response.data);
      alert("로그인에 성공했습니다!");
      router.push("/chat");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || "로그인에 실패했습니다.";
        alert(message);
      } else {
        alert("알 수 없는 에러가 발생했습니다.");
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
