import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-8 border-t border-[var(--border-color)] bg-white">
      <div className="mx-auto max-w-[1100px] px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[12px] text-[#999]">
            <span className="font-bold text-[var(--primary)]">DHWAR</span>
            <span className="ml-2">대학생 커뮤니티</span>
          </div>
          <nav className="flex items-center gap-4 text-[11px] text-[#aaa]">
            <Link href="/gallery" className="hover:text-[#666]">
              갤러리
            </Link>
            <Link href="/hit" className="hover:text-[#666]">
              실시간베스트
            </Link>
            <Link href="/ranking" className="hover:text-[#666]">
              대학랭킹
            </Link>
          </nav>
        </div>
        <div className="mt-4 text-center text-[11px] text-[#ccc]">
          &copy; {new Date().getFullYear()} DHWAR. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
