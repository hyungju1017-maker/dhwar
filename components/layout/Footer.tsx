import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-gray-300 bg-[#f0f0f0]">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-3 px-4 py-6 text-xs text-gray-500">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/terms" className="hover:text-gray-800 hover:underline">
            이용약관
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/privacy" className="hover:text-gray-800 hover:underline">
            개인정보처리방침
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/contact" className="hover:text-gray-800 hover:underline">
            문의하기
          </Link>
        </div>
        <p className="text-center text-gray-400">
          &copy; {new Date().getFullYear()} 大學大戰. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
