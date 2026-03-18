"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BrushLogo } from "./BrushLogo";

export function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery)}&type=title`);
    setSearchQuery("");
  };

  return (
    <header>
      {/* Top section: logo left, login/search right */}
      <div style={{ backgroundColor: "#8b0000" }} className="text-white">
        <div className="mx-auto max-w-[1100px] px-4">
          <div className="flex items-end justify-between py-3">
            {/* Logo - brush calligraphy canvas */}
            <Link href="/" className="block">
              <BrushLogo />
            </Link>

            {/* Right side: auth + search */}
            <div className="flex flex-col items-end gap-2 pb-2">
              <div className="flex items-center gap-3 text-[12px]">
                {session ? (
                  <>
                    <span>
                      <span className="font-medium">
                        {(session.user as any)?.nickname}
                      </span>
                      <span className="ml-1 opacity-70">
                        ({(session.user as any)?.universityShortName})
                      </span>
                    </span>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="opacity-70 hover:opacity-100"
                    >
                      로그아웃
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/signin" className="opacity-80 hover:opacity-100">
                      로그인
                    </Link>
                    <Link href="/auth/signup" className="opacity-80 hover:opacity-100">
                      회원가입
                    </Link>
                  </>
                )}
              </div>
              <form onSubmit={handleSearch} className="flex items-center gap-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="검색"
                  className="h-[28px] w-[180px] rounded px-2 text-[12px] text-[#333] outline-none"
                />
                <button
                  type="submit"
                  className="h-[28px] rounded bg-white/20 px-3 text-[12px] hover:bg-white/30"
                >
                  검색
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <div style={{ backgroundColor: "#6b0000" }} className="text-white">
        <div className="mx-auto max-w-[1100px] px-4">
          <nav className="flex items-center gap-6 py-2 text-[14px] font-medium">
            <Link href="/gallery" className="opacity-90 hover:opacity-100 hover:underline">
              게시판
            </Link>
            <Link href="/hit" className="opacity-90 hover:opacity-100 hover:underline">
              실시간베스트
            </Link>
            <Link href="/ranking" className="opacity-90 hover:opacity-100 hover:underline">
              대학랭킹
            </Link>
            <Link href="/ranking/users" className="opacity-90 hover:opacity-100 hover:underline">
              유저랭킹
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
