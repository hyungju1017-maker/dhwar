import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Show a window of pages around the current page
  const WINDOW = 5;
  const half = Math.floor(WINDOW / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, start + WINDOW - 1);
  if (end - start < WINDOW - 1) {
    start = Math.max(1, end - WINDOW + 1);
  }

  const pages: number[] = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  const buildUrl = (page: number) => {
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}page=${page}`;
  };

  const linkClass =
    "flex h-8 w-8 items-center justify-center rounded border text-xs transition-colors";

  return (
    <nav className="mt-4 flex items-center justify-center gap-1">
      {/* First page */}
      {currentPage > 1 && (
        <>
          <Link
            href={buildUrl(1)}
            className={`${linkClass} border-gray-300 bg-white text-gray-600 hover:bg-gray-100`}
            aria-label="첫 페이지"
          >
            &laquo;
          </Link>
          <Link
            href={buildUrl(currentPage - 1)}
            className={`${linkClass} border-gray-300 bg-white text-gray-600 hover:bg-gray-100`}
            aria-label="이전 페이지"
          >
            &lsaquo;
          </Link>
        </>
      )}

      {/* Page numbers */}
      {pages.map((page) => (
        <Link
          key={page}
          href={buildUrl(page)}
          className={`${linkClass} ${
            page === currentPage
              ? "border-[#3b4890] bg-[#3b4890] font-bold text-white"
              : "border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          {page}
        </Link>
      ))}

      {/* Next / last page */}
      {currentPage < totalPages && (
        <>
          <Link
            href={buildUrl(currentPage + 1)}
            className={`${linkClass} border-gray-300 bg-white text-gray-600 hover:bg-gray-100`}
            aria-label="다음 페이지"
          >
            &rsaquo;
          </Link>
          <Link
            href={buildUrl(totalPages)}
            className={`${linkClass} border-gray-300 bg-white text-gray-600 hover:bg-gray-100`}
            aria-label="마지막 페이지"
          >
            &raquo;
          </Link>
        </>
      )}
    </nav>
  );
}
