"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <header className="dc-header">
      <div className="mx-auto max-w-[1100px] px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-2 text-[12px] border-b border-white/20">
          <div className="flex items-center gap-3">
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
                <Link href="/auth/signin" className="opacity-70 hover:opacity-100">
                  로그인
                </Link>
                <Link href="/auth/signup" className="opacity-70 hover:opacity-100">
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
              className="h-[24px] w-[160px] rounded px-2 text-[12px] text-[#333] outline-none"
            />
            <button
              type="submit"
              className="h-[24px] rounded bg-white/20 px-2 text-[11px] hover:bg-white/30"
            >
              검색
            </button>
          </form>
        </div>

        {/* Main nav */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-[18px] font-black tracking-tight">
              DHWAR
            </Link>
            <nav className="hidden sm:flex items-center gap-4 text-[13px]">
              <Link href="/gallery" className="opacity-80 hover:opacity-100">
                갤러리
              </Link>
              <Link href="/hit" className="opacity-80 hover:opacity-100">
                실시간베스트
              </Link>
              <Link href="/ranking" className="opacity-80 hover:opacity-100">
                대학랭킹
              </Link>
              <Link href="/ranking/users" className="opacity-80 hover:opacity-100">
                유저랭킹
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
