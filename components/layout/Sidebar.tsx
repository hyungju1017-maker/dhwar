"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import UniversityBadge from "../ui/UniversityBadge";

interface HitPost {
  id: string;
  title: string;
  upvoteCount: number;
  gallerySlug: string;
}

interface RankedUniversity {
  id: string;
  name: string;
  shortName: string;
  totalPoints: number;
}

export default function Sidebar() {
  const [hitPosts, setHitPosts] = useState<HitPost[]>([]);
  const [universities, setUniversities] = useState<RankedUniversity[]>([]);

  useEffect(() => {
    fetch("/api/hit")
      .then((res) => res.json())
      .then((data) => setHitPosts((data.posts ?? data).slice(0, 10)))
      .catch(() => {});

    fetch("/api/ranking/universities")
      .then((res) => res.json())
      .then((data) =>
        setUniversities((data.universities ?? data).slice(0, 5)),
      )
      .catch(() => {});
  }, []);

  return (
    <aside className="flex w-full flex-col gap-4 lg:w-[280px]">
      {/* Real-time best */}
      <div className="rounded border border-gray-300 bg-white">
        <div className="border-b border-gray-300 bg-[#8b0000] px-3 py-2">
          <h3 className="text-sm font-bold text-white">실시간 베스트</h3>
        </div>
        <ul className="divide-y divide-gray-100">
          {hitPosts.length === 0 && (
            <li className="px-3 py-2 text-xs text-gray-400">
              게시글이 없습니다.
            </li>
          )}
          {hitPosts.map((post, idx) => (
            <li key={post.id}>
              <Link
                href={`/gallery/${post.gallerySlug}/${post.id}`}
                className="flex items-start gap-2 px-3 py-1.5 text-xs hover:bg-gray-50"
              >
                <span className="mt-px shrink-0 font-bold text-[#8b0000]">
                  {idx + 1}
                </span>
                <span className="line-clamp-1 flex-1 text-gray-800">
                  {post.title}
                </span>
                <span className="shrink-0 text-red-500">
                  [{post.upvoteCount}]
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/hit"
          className="block border-t border-gray-200 px-3 py-1.5 text-center text-xs text-gray-500 hover:bg-gray-50"
        >
          더보기 &gt;
        </Link>
      </div>

      {/* University ranking */}
      <div className="rounded border border-gray-300 bg-white">
        <div className="border-b border-gray-300 bg-[#8b0000] px-3 py-2">
          <h3 className="text-sm font-bold text-white">대학 랭킹</h3>
        </div>
        <ul className="divide-y divide-gray-100">
          {universities.length === 0 && (
            <li className="px-3 py-2 text-xs text-gray-400">
              데이터를 불러오는 중...
            </li>
          )}
          {universities.map((uni, idx) => (
            <li
              key={uni.id}
              className="flex items-center gap-2 px-3 py-1.5 text-xs"
            >
              <span
                className={`shrink-0 font-bold ${idx < 3 ? "text-[#e8a20c]" : "text-gray-400"}`}
              >
                {idx + 1}
              </span>
              <UniversityBadge name={uni.name} shortName={uni.shortName} />
              <span className="flex-1 text-gray-800">{uni.name}</span>
              <span className="text-gray-500">
                {uni.totalPoints.toLocaleString()}P
              </span>
            </li>
          ))}
        </ul>
        <Link
          href="/ranking"
          className="block border-t border-gray-200 px-3 py-1.5 text-center text-xs text-gray-500 hover:bg-gray-50"
        >
          더보기 &gt;
        </Link>
      </div>
    </aside>
  );
}
