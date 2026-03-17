"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import UniversityBadge from "../ui/UniversityBadge";

export default function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-[#3b4890] text-white shadow-md">
      {/* Top bar */}
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-2">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-extrabold tracking-tight">
            DHWAR
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/gallery"
            className="text-sm font-medium text-gray-200 transition-colors hover:text-white"
          >
            갤러리
          </Link>
          <Link
            href="/hit"
            className="text-sm font-medium text-gray-200 transition-colors hover:text-white"
          >
            실시간베스트
          </Link>
          <Link
            href="/ranking"
            className="text-sm font-medium text-gray-200 transition-colors hover:text-white"
          >
            대학랭킹
          </Link>
        </nav>

        {/* Desktop user area */}
        <div className="hidden items-center gap-3 md:flex">
          {session?.user ? (
            <div className="flex items-center gap-3">
              <UniversityBadge
                name={session.user.universityName}
                shortName={session.user.universityShortName}
              />
              <Link
                href="/mypage"
                className="text-sm font-medium hover:underline"
              >
                {session.user.nickname}
              </Link>
              <span className="text-xs text-gray-300">
                {session.user.points}P
              </span>
              <button
                onClick={() => signOut()}
                className="rounded border border-gray-400 px-3 py-1 text-xs text-gray-200 transition-colors hover:bg-white/10"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/signin"
                className="rounded border border-gray-400 px-3 py-1 text-xs text-gray-200 transition-colors hover:bg-white/10"
              >
                로그인
              </Link>
              <Link
                href="/auth/signup"
                className="rounded bg-white px-3 py-1 text-xs font-semibold text-[#3b4890] transition-colors hover:bg-gray-100"
              >
                회원가입
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex flex-col gap-1 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="메뉴 열기"
        >
          <span
            className={`block h-0.5 w-5 bg-white transition-transform ${mobileMenuOpen ? "translate-y-1.5 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-5 bg-white transition-opacity ${mobileMenuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-5 bg-white transition-transform ${mobileMenuOpen ? "-translate-y-1.5 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-white/20 bg-[#2f3c78] px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link
              href="/gallery"
              className="text-sm text-gray-200 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              갤러리
            </Link>
            <Link
              href="/hit"
              className="text-sm text-gray-200 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              실시간베스트
            </Link>
            <Link
              href="/ranking"
              className="text-sm text-gray-200 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              대학랭킹
            </Link>
          </nav>
          <div className="mt-3 border-t border-white/10 pt-3">
            {session?.user ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <UniversityBadge
                    name={session.user.universityName}
                    shortName={session.user.universityShortName}
                  />
                  <span className="text-sm">{session.user.nickname}</span>
                  <span className="text-xs text-gray-300">
                    {session.user.points}P
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="w-full rounded border border-gray-400 py-1.5 text-xs text-gray-200 hover:bg-white/10"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/auth/signin"
                  className="flex-1 rounded border border-gray-400 py-1.5 text-center text-xs text-gray-200 hover:bg-white/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  로그인
                </Link>
                <Link
                  href="/auth/signup"
                  className="flex-1 rounded bg-white py-1.5 text-center text-xs font-semibold text-[#3b4890] hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
