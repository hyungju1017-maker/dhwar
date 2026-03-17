import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { HIT_THRESHOLD } from "@/lib/constants";
import { timeAgo, formatNumber } from "@/lib/utils";

export default async function HomePage() {
  const galleries = await prisma.gallery.findMany({
    where: { isActive: true, type: "MAJOR" },
    orderBy: { todayPostCount: "desc" },
    take: 30,
    include: { category: true },
  });

  const hotPosts = await prisma.post.findMany({
    where: {
      isDeleted: false,
      upvoteCount: { gte: HIT_THRESHOLD },
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
    orderBy: { upvoteCount: "desc" },
    take: 15,
    include: {
      gallery: { select: { slug: true, name: true } },
      author: { select: { nickname: true } },
    },
  });

  const universities = await prisma.university.findMany({
    orderBy: { totalPoints: "desc" },
    take: 10,
  });

  const categorized = galleries.reduce(
    (acc, g) => {
      const cat = g.category?.name || "기타";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(g);
      return acc;
    },
    {} as Record<string, typeof galleries>
  );

  const categoryNames = Object.keys(categorized);

  return (
    <div className="flex gap-4">
      {/* Left main area */}
      <div className="flex-1 min-w-0">
        {/* Category tabs */}
        <div className="dc-tabs mb-0">
          <Link href="/gallery" className="dc-tab dc-tab-active">
            주요 갤러리
          </Link>
          <Link href="/gallery?type=MINOR" className="dc-tab">
            마이너 갤러리
          </Link>
          <Link href="/gallery?type=MINI" className="dc-tab">
            미니 갤러리
          </Link>
        </div>

        {/* Gallery list by category */}
        <div className="dc-card mt-0 rounded-t-none">
          {categoryNames.map((catName) => (
            <div key={catName} className="border-b border-[var(--border-color)] last:border-b-0">
              <div className="bg-[#f9f9f9] px-3 py-2 text-xs font-bold text-[#666]">
                {catName}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3">
                {categorized[catName].map((gallery) => (
                  <Link
                    key={gallery.id}
                    href={`/gallery/${gallery.slug}`}
                    className="flex items-center justify-between px-3 py-[6px] text-[13px] hover:bg-[#f5f5f5] border-b border-[#f0f0f0]"
                  >
                    <span className="text-[#333] truncate">{gallery.name}</span>
                    {gallery.todayPostCount > 0 && (
                      <span className="ml-1 text-[11px] text-red-500 font-bold">
                        {gallery.todayPostCount}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {galleries.length === 0 && (
            <div className="p-8 text-center text-sm text-[#999]">
              등록된 갤러리가 없습니다.
            </div>
          )}
        </div>

        {/* Hot posts preview on main */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[15px] font-bold text-[var(--primary)]">
              실시간 베스트
            </h2>
            <Link href="/hit" className="text-xs text-[#999] hover:text-[var(--primary)]">
              더보기 &gt;
            </Link>
          </div>
          <div className="dc-card">
            <table className="dc-table">
              <thead>
                <tr>
                  <th className="w-[60px]">갤러리</th>
                  <th>제목</th>
                  <th className="w-[70px]">글쓴이</th>
                  <th className="w-[50px]">추천</th>
                  <th className="w-[50px]">조회</th>
                  <th className="w-[70px]">날짜</th>
                </tr>
              </thead>
              <tbody>
                {hotPosts.map((post) => (
                  <tr key={post.id}>
                    <td className="text-center text-[11px] text-[#999]">
                      <Link href={`/gallery/${post.gallery.slug}`} className="hover:text-[var(--primary)]">
                        {post.gallery.name}
                      </Link>
                    </td>
                    <td className="post-title">
                      <Link href={`/gallery/${post.gallery.slug}/${post.id}`}>
                        {post.title}
                        {post.commentCount > 0 && (
                          <span className="ml-1 text-[var(--primary)] text-[11px] font-bold">
                            [{post.commentCount}]
                          </span>
                        )}
                      </Link>
                    </td>
                    <td className="text-center text-[12px] text-[#666]">
                      {post.author.nickname}
                    </td>
                    <td className="text-center text-[12px] font-bold text-[var(--primary)]">
                      {post.upvoteCount}
                    </td>
                    <td className="text-center text-[12px] text-[#999]">
                      {formatNumber(post.viewCount)}
                    </td>
                    <td className="text-center text-[11px] text-[#999]">
                      {timeAgo(post.createdAt)}
                    </td>
                  </tr>
                ))}
                {hotPosts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-sm text-[#999]">
                      아직 베스트 글이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="hidden md:block w-[250px] shrink-0 space-y-4">
        {/* 실시간 베스트 sidebar */}
        <div className="dc-sidebar">
          <div className="dc-sidebar-header">실시간 베스트</div>
          {hotPosts.slice(0, 8).map((post, i) => (
            <div key={post.id} className="dc-sidebar-item flex items-start gap-2">
              <span className="text-[11px] font-bold text-[var(--primary)] w-[16px] shrink-0">
                {i + 1}
              </span>
              <Link
                href={`/gallery/${post.gallery.slug}/${post.id}`}
                className="truncate flex-1"
              >
                {post.title}
              </Link>
            </div>
          ))}
          {hotPosts.length === 0 && (
            <div className="dc-sidebar-item text-[#999]">게시글이 없습니다.</div>
          )}
        </div>

        {/* University ranking sidebar */}
        <div className="dc-sidebar">
          <div className="dc-sidebar-header">대학랭킹</div>
          {universities.map((uni, i) => (
            <div key={uni.id} className="dc-sidebar-item flex items-center gap-2">
              <span
                className={`text-[11px] font-bold w-[16px] shrink-0 ${
                  i === 0
                    ? "text-red-500"
                    : i === 1
                    ? "text-[var(--primary)]"
                    : i === 2
                    ? "text-green-600"
                    : "text-[#999]"
                }`}
              >
                {i + 1}
              </span>
              <span className="flex-1 truncate">{uni.name}</span>
              <span className="text-[11px] text-[#999]">
                {formatNumber(uni.totalPoints)}점
              </span>
            </div>
          ))}
          {universities.length === 0 && (
            <div className="dc-sidebar-item text-[#999]">데이터가 없습니다.</div>
          )}
          <div className="p-2 text-center">
            <Link
              href="/ranking"
              className="text-[11px] text-[var(--primary)] hover:underline"
            >
              전체 랭킹 보기 &gt;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
