import Header from "./components/Header";
import "./globals.css";

export const metadata = {
  title: "실시간 채팅",
  description: "간단한 실시간 채팅 앱",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-gray-100 min-h-screen">
        <Header /> {/* 이걸 추가해야 헤더 적용돼! */}
        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
