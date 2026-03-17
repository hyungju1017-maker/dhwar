import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { HIT_THRESHOLD, PAGE_SIZE } from "@/lib/constants";
import { timeAgo, formatNumber } from "@/lib/utils";

export default async function HitPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10) || 1);

  const where = {
    isDeleted: false,
    upvoteCount: { gte: HIT_THRESHOLD },
    createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  };

  const totalPosts = await prisma.post.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalPosts / PAGE_SIZE));

  const posts = await prisma.post.findMany({
    where,
    orderBy: { upvoteCount: "desc" },
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: {
      gallery: { select: { slug: true, name: true } },
      author: {
        select: {
          nickname: true,
          university: { select: { shortName: true } },
        },
      },
    },
  });

  const pageGroupSize = 10;
  const currentGroup = Math.floor((currentPage - 1) / pageGroupSize);
  const startPage = currentGroup * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

  return (
    <div>
      <h1 className="text-[16px] font-bold text-[var(--primary)] mb-3">
        실시간 베스트
      </h1>
      <p className="text-[12px] text-[#999] mb-4">
        최근 24시간 동안 추천 {HIT_THRESHOLD}개 이상을 받은 게시글입니다.
      </p>

      <table className="dc-table">
        <thead>
          <tr>
            <th className="w-[50px]">순위</th>
            <th className="w-[80px]">갤러리</th>
            <th>제목</th>
            <th className="w-[90px]">글쓴이</th>
            <th className="w-[50px]">추천</th>
            <th className="w-[50px]">조회</th>
            <th className="w-[70px]">날짜</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, i) => {
            const rank = (currentPage - 1) * PAGE_SIZE + i + 1;
            return (
              <tr key={post.id} className={i < 3 && currentPage === 1 ? "row-concept" : ""}>
                <td
                  className={`text-center font-bold text-[13px] ${
                    rank === 1
                      ? "text-red-500"
                      : rank === 2
                      ? "text-[var(--primary)]"
                      : rank === 3
                      ? "text-green-600"
                      : "text-[#999]"
                  }`}
                >
                  {rank}
                </td>
                <td className="text-center text-[11px]">
                  <Link
                    href={`/gallery/${post.gallery.slug}`}
                    className="text-[#666] hover:text-[var(--primary)]"
                  >
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
                  {post.author.university?.shortName && (
                    <span className="badge-university">
                      {post.author.university.shortName}
                    </span>
                  )}
                </td>
                <td className="text-center text-[13px] font-bold text-[var(--primary)]">
                  {post.upvoteCount}
                </td>
                <td className="text-center text-[12px] text-[#999]">
                  {formatNumber(post.viewCount)}
                </td>
                <td className="text-center text-[11px] text-[#999]">
                  {timeAgo(post.createdAt)}
                </td>
              </tr>
            );
          })}
          {posts.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-8 text-sm text-[#999]">
                아직 베스트 글이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="dc-pagination mt-4">
          {currentPage > 1 && <Link href={`/hit?page=1`}>&laquo;</Link>}
          {startPage > 1 && (
            <Link href={`/hit?page=${startPage - 1}`}>&lsaquo;</Link>
          )}
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(
            (p) => (
              <Link
                key={p}
                href={`/hit?page=${p}`}
                className={p === currentPage ? "active" : ""}
              >
                {p}
              </Link>
            )
          )}
          {endPage < totalPages && (
            <Link href={`/hit?page=${endPage + 1}`}>&rsaquo;</Link>
          )}
          {currentPage < totalPages && (
            <Link href={`/hit?page=${totalPages}`}>&raquo;</Link>
          )}
        </div>
      )}
    </div>
  );
}
