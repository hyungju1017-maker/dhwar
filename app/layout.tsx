import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});


export const metadata: Metadata = {
  title: "大學大戰 - 대학생 커뮤니티",
  description:
    "대학생들을 위한 익명 커뮤니티. 대학교 인증 기반 게시판, 실시간 베스트, 대학 랭킹을 제공합니다.",
  keywords: ["대학생", "커뮤니티", "게시판", "익명", "대학교"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=East+Sea+Dokdo&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${notoSansKR.variable} font-sans antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="mx-auto w-full max-w-[1100px] flex-1 px-4 py-4">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
