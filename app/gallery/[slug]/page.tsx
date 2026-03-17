import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PAGE_SIZE } from "@/lib/constants";
import { timeAgo, getPostTypeLabel } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function GalleryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; filter?: string }>;
}) {
  const { slug } = await params;
  const { page: pageStr, filter } = await searchParams;

  const gallery = await prisma.gallery.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!gallery || !gallery.isActive) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const currentPage = Math.max(1, parseInt(pageStr || "1", 10) || 1);

  // Build where clause based on filter
  const where: any = { galleryId: gallery.id, isDeleted: false };
  if (filter === "concept") {
    where.postType = "CONCEPT";
  } else if (filter === "notice") {
    where.isNotice = true;
  }

  const totalPosts = await prisma.post.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalPosts / PAGE_SIZE));

  // Get pinned/notice posts first (only on page 1)
  const noticePosts =
    currentPage === 1
      ? await prisma.post.findMany({
          where: {
            galleryId: gallery.id,
            isDeleted: false,
            OR: [{ isNotice: true }, { isPinned: true }],
          },
          orderBy: { createdAt: "desc" },
          take: 5,
          include: {
            author: {
              select: { nickname: true, university: { select: { shortName: true } } },
            },
          },
        })
      : [];

  const noticeIds = noticePosts.map((p) => p.id);

  const posts = await prisma.post.findMany({
    where: {
      ...where,
      id: { notIn: noticeIds },
    },
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: {
      author: {
        select: { nickname: true, university: { select: { shortName: true } } },
      },
    },
  });

  // Recent hot posts for sidebar
  const hotPosts = await prisma.post.findMany({
    where: {
      galleryId: gallery.id,
      isDeleted: false,
      upvoteCount: { gte: 5 },
      createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    },
    orderBy: { upvoteCount: "desc" },
    take: 8,
  });

  // Pagination range
  const pageGroupSize = 10;
  const currentGroup = Math.floor((currentPage - 1) / pageGroupSize);
  const startPage = currentGroup * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

  const filterBase = filter ? `&filter=${filter}` : "";

  return (
    <div className="flex gap-4">
      <div className="flex-1 min-w-0">
        {/* Gallery header */}
        <div className="dc-card p-4 mb-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[16px] font-bold text-[var(--primary)]">
                {gallery.name}
              </h1>
              {gallery.description && (
                <p className="text-[12px] text-[#999] mt-1">{gallery.description}</p>
              )}
            </div>
            <div className="text-[12px] text-[#999]">
              총 <span className="font-bold text-[#333]">{gallery.postCount}</span>개의 글
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="dc-tabs">
          <Link
            href={`/gallery/${slug}`}
            className={`dc-tab ${!filter ? "dc-tab-active" : ""}`}
          >
            전체
          </Link>
          <Link
            href={`/gallery/${slug}?filter=concept`}
            className={`dc-tab ${filter === "concept" ? "dc-tab-active" : ""}`}
          >
            개념글
          </Link>
          <Link
            href={`/gallery/${slug}?filter=notice`}
            className={`dc-tab ${filter === "notice" ? "dc-tab-active" : ""}`}
          >
            공지
          </Link>
        </div>

        {/* Post table */}
        <table className="dc-table">
          <thead>
            <tr>
              <th className="w-[50px]">번호</th>
              <th>제목</th>
              <th className="w-[90px]">글쓴이</th>
              <th className="w-[70px]">날짜</th>
              <th className="w-[40px]">조회</th>
              <th className="w-[40px]">추천</th>
            </tr>
          </thead>
          <tbody>
            {/* Notice posts */}
            {noticePosts.map((post) => (
              <tr key={post.id} className="row-notice">
                <td className="text-center text-[12px]">
                  <span className="badge-notice">공지</span>
                </td>
                <td className="post-title">
                  <Link href={`/gallery/${slug}/${post.id}`}>
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
                <td className="text-center text-[11px] text-[#999]">
                  {timeAgo(post.createdAt)}
                </td>
                <td className="text-center text-[12px] text-[#999]">{post.viewCount}</td>
                <td className="text-center text-[12px] text-[#999]">{post.upvoteCount}</td>
              </tr>
            ))}

            {/* Regular posts */}
            {posts.map((post) => (
              <tr
                key={post.id}
                className={post.postType === "CONCEPT" ? "row-concept" : ""}
              >
                <td className="text-center text-[12px] text-[#999]">{post.number}</td>
                <td className="post-title">
                  {post.postType !== "NORMAL" && (
                    <span
                      className={
                        post.postType === "CONCEPT"
                          ? "badge-concept"
                          : post.postType === "RECOMMEND"
                          ? "badge-recommend"
                          : ""
                      }
                    >
                      {getPostTypeLabel(post.postType)}
                    </span>
                  )}
                  <Link href={`/gallery/${slug}/${post.id}`}>
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
                <td className="text-center text-[11px] text-[#999]">
                  {timeAgo(post.createdAt)}
                </td>
                <td className="text-center text-[12px] text-[#999]">{post.viewCount}</td>
                <td className="text-center text-[12px] text-[#999]">{post.upvoteCount}</td>
              </tr>
            ))}

            {posts.length === 0 && noticePosts.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-sm text-[#999]">
                  게시글이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Bottom bar with write button */}
        <div className="flex items-center justify-between mt-3">
          <div />
          {session && (
            <Link href={`/gallery/${slug}/write`} className="dc-btn dc-btn-primary">
              글쓰기
            </Link>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="dc-pagination mt-4">
            {currentPage > 1 && (
              <Link href={`/gallery/${slug}?page=1${filterBase}`}>&laquo;</Link>
            )}
            {startPage > 1 && (
              <Link href={`/gallery/${slug}?page=${startPage - 1}${filterBase}`}>
                &lsaquo;
              </Link>
            )}
            {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(
              (p) => (
                <Link
                  key={p}
                  href={`/gallery/${slug}?page=${p}${filterBase}`}
                  className={p === currentPage ? "active" : ""}
                >
                  {p}
                </Link>
              )
            )}
            {endPage < totalPages && (
              <Link href={`/gallery/${slug}?page=${endPage + 1}${filterBase}`}>
                &rsaquo;
              </Link>
            )}
            {currentPage < totalPages && (
              <Link href={`/gallery/${slug}?page=${totalPages}${filterBase}`}>
                &raquo;
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Right sidebar */}
      <div className="hidden lg:block w-[220px] shrink-0 space-y-4">
        <div className="dc-sidebar">
          <div className="dc-sidebar-header">갤러리 인기글</div>
          {hotPosts.map((post, i) => (
            <div key={post.id} className="dc-sidebar-item flex items-start gap-2">
              <span className="text-[11px] font-bold text-[var(--primary)] w-[14px] shrink-0">
                {i + 1}
              </span>
              <Link
                href={`/gallery/${slug}/${post.id}`}
                className="truncate flex-1 text-[12px]"
              >
                {post.title}
              </Link>
            </div>
          ))}
          {hotPosts.length === 0 && (
            <div className="dc-sidebar-item text-[12px] text-[#999]">
              인기글이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
