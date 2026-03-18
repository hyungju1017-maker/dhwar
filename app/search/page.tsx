"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

interface SearchResult {
  id: string;
  title: string;
  contentText: string | null;
  upvoteCount: number;
  viewCount: number;
  commentCount: number;
  createdAt: string;
  author: { nickname: string };
  gallery: { slug: string; name: string };
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-8 text-[#999]">로딩 중...</div>}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams.get("q") || "";
  const initialType = searchParams.get("type") || "title";

  const [query, setQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState(initialType);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = async (q: string, type: string) => {
    if (!q.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(
        `/api/galleries?search=${encodeURIComponent(q)}&searchType=${type}`
      );
      const data = await res.json();
      setResults(data.posts || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      doSearch(initialQuery, initialType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}&type=${searchType}`);
    doSearch(query, searchType);
  };

  const timeAgo = (dateStr: string) => {
    const now = new Date();
    const past = new Date(dateStr);
    const diffMs = now.getTime() - past.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return "방금 전";
    if (diffMin < 60) return `${diffMin}분 전`;
    if (diffHour < 24) return `${diffHour}시간 전`;
    if (diffDay < 7) return `${diffDay}일 전`;

    const m = String(past.getMonth() + 1).padStart(2, "0");
    const d = String(past.getDate()).padStart(2, "0");
    return `${m}.${d}`;
  };

  return (
    <div>
      <h1 className="text-[16px] font-bold text-[#8b0000] mb-4">검색</h1>

      {/* Search form */}
      <div className="dc-card p-4 mb-4">
        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
          <div className="flex-1">
            <div className="flex gap-3 mb-2">
              <label className="flex items-center gap-1 text-[12px] text-[#666] cursor-pointer">
                <input
                  type="radio"
                  name="searchType"
                  value="title"
                  checked={searchType === "title"}
                  onChange={() => setSearchType("title")}
                  className="accent-[#8b0000]"
                />
                제목
              </label>
              <label className="flex items-center gap-1 text-[12px] text-[#666] cursor-pointer">
                <input
                  type="radio"
                  name="searchType"
                  value="content"
                  checked={searchType === "content"}
                  onChange={() => setSearchType("content")}
                  className="accent-[#8b0000]"
                />
                내용
              </label>
              <label className="flex items-center gap-1 text-[12px] text-[#666] cursor-pointer">
                <input
                  type="radio"
                  name="searchType"
                  value="both"
                  checked={searchType === "both"}
                  onChange={() => setSearchType("both")}
                  className="accent-[#8b0000]"
                />
                제목+내용
              </label>
              <label className="flex items-center gap-1 text-[12px] text-[#666] cursor-pointer">
                <input
                  type="radio"
                  name="searchType"
                  value="author"
                  checked={searchType === "author"}
                  onChange={() => setSearchType("author")}
                  className="accent-[#8b0000]"
                />
                글쓴이
              </label>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="dc-input"
              placeholder="검색어를 입력하세요"
              autoFocus
            />
          </div>
          <button type="submit" className="dc-btn dc-btn-primary h-[36px] px-6">
            검색
          </button>
        </form>
      </div>

      {/* Results */}
      {loading && (
        <div className="text-center py-8 text-[13px] text-[#999]">검색 중...</div>
      )}

      {!loading && searched && (
        <div>
          <div className="text-[12px] text-[#999] mb-2">
            검색 결과{" "}
            <span className="font-bold text-[#333]">{results.length}</span>건
          </div>

          {results.length > 0 ? (
            <table className="dc-table">
              <thead>
                <tr>
                  <th className="w-[80px]">게시판</th>
                  <th>제목</th>
                  <th className="w-[80px]">글쓴이</th>
                  <th className="w-[50px]">추천</th>
                  <th className="w-[50px]">조회</th>
                  <th className="w-[70px]">날짜</th>
                </tr>
              </thead>
              <tbody>
                {results.map((post) => (
                  <tr key={post.id}>
                    <td className="text-center text-[11px] text-[#999]">
                      <Link
                        href={`/gallery/${post.gallery.slug}`}
                        className="hover:text-[#8b0000]"
                      >
                        {post.gallery.name}
                      </Link>
                    </td>
                    <td className="post-title">
                      <Link href={`/gallery/${post.gallery.slug}/${post.id}`}>
                        {post.title}
                        {post.commentCount > 0 && (
                          <span className="ml-1 text-[#8b0000] text-[11px] font-bold">
                            [{post.commentCount}]
                          </span>
                        )}
                      </Link>
                    </td>
                    <td className="text-center text-[12px] text-[#666]">
                      {post.author.nickname}
                    </td>
                    <td className="text-center text-[12px] font-bold text-[#8b0000]">
                      {post.upvoteCount}
                    </td>
                    <td className="text-center text-[12px] text-[#999]">
                      {post.viewCount}
                    </td>
                    <td className="text-center text-[11px] text-[#999]">
                      {timeAgo(post.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="dc-card p-8 text-center text-[13px] text-[#999]">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
