"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Header = () => {
  const [nickname, setNickname] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const name = localStorage.getItem("nickname");
    console.log("로컬스토리지 확인 → token:", token, "nickname:", name);
    if (token && name) {
      setNickname(name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("nickname");
    alert("로그아웃 되었습니다.");
    setNickname(null);
    router.push("/login");
  };

  return (
    <header className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-black">실시간 채팅</h1>
      <div className="space-x-4">
        {nickname ? (
          <>
            <span className="font-semibold">{nickname}님</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-600"
            >
              로그인
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-600"
            >
              회원가입
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
