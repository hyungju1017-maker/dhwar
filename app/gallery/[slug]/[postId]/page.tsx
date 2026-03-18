import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { timeAgo } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { VoteButtons } from "@/components/VoteButtons";
import { CommentSection } from "@/components/CommentSection";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string; postId: string }>;
}) {
  const { slug, postId } = await params;

  const gallery = await prisma.gallery.findUnique({ where: { slug } });
  if (!gallery) notFound();

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: {
        select: {
          id: true,
          nickname: true,
          university: { select: { name: true, shortName: true } },
        },
      },
      images: { orderBy: { order: "asc" } },
    },
  });

  if (!post || post.isDeleted || post.galleryId !== gallery.id) {
    notFound();
  }

  // Increment view count
  await prisma.post.update({
    where: { id: postId },
    data: { viewCount: { increment: 1 } },
  });

  const session = await getServerSession(authOptions);
  const currentUserId = (session?.user as any)?.id;

  // Check if user already voted
  let userVote: number | null = null;
  if (currentUserId) {
    const vote = await prisma.postVote.findUnique({
      where: { userId_postId: { userId: currentUserId, postId } },
    });
    if (vote) userVote = vote.value;
  }

  // Fetch comments
  const comments = await prisma.comment.findMany({
    where: { postId, isDeleted: false, parentId: null },
    orderBy: { createdAt: "asc" },
    include: {
      author: {
        select: {
          id: true,
          nickname: true,
          university: { select: { shortName: true } },
        },
      },
      replies: {
        where: { isDeleted: false },
        orderBy: { createdAt: "asc" },
        include: {
          author: {
            select: {
              id: true,
              nickname: true,
              university: { select: { shortName: true } },
            },
          },
        },
      },
    },
  });

  return (
    <div className="max-w-[800px] mx-auto">
      {/* Breadcrumb */}
      <div className="text-[12px] text-[#999] mb-3">
        <Link href="/" className="hover:text-[#8b0000]">
          홈
        </Link>
        <span className="mx-1">&gt;</span>
        <Link href={`/gallery/${slug}`} className="hover:text-[#8b0000]">
          {gallery.name}
        </Link>
        <span className="mx-1">&gt;</span>
        <span className="text-[#666]">{post.number}</span>
      </div>

      {/* Post header */}
      <div className="dc-card">
        <div className="p-4 border-b border-[var(--border-color)]">
          <h1 className="text-[17px] font-bold text-[#222] leading-snug">
            {post.postType === "CONCEPT" && (
              <span className="badge-concept">개념글</span>
            )}
            {post.postType === "NOTICE" && (
              <span className="badge-notice">공지</span>
            )}
            {post.title}
          </h1>
          <div className="flex items-center gap-3 mt-2 text-[12px] text-[#999]">
            <span className="text-[#333] font-medium">
              {post.author.nickname}
              {post.author.university?.shortName && (
                <span className="badge-university">
                  {post.author.university.shortName}
                </span>
              )}
            </span>
            <span>{timeAgo(post.createdAt)}</span>
            <span>조회 {post.viewCount + 1}</span>
            <span>추천 {post.upvoteCount}</span>
            <span>댓글 {post.commentCount}</span>
          </div>
        </div>

        {/* Post content */}
        <div className="p-4 min-h-[200px] text-[14px] leading-relaxed text-[#333] whitespace-pre-wrap break-words">
          {post.content}

          {/* Images */}
          {post.images.length > 0 && (
            <div className="mt-4 space-y-3">
              {post.images.map((img) => (
                <div key={img.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt="첨부 이미지"
                    className="max-w-full rounded"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vote section */}
        <div className="flex justify-center gap-4 py-6 border-t border-[var(--border-color)]">
          <VoteButtons
            postId={post.id}
            upvoteCount={post.upvoteCount}
            downvoteCount={post.downvoteCount}
            userVote={userVote}
            isLoggedIn={!!session}
          />
        </div>
      </div>

      {/* Comment section */}
      <div className="mt-4">
        <div className="text-[14px] font-bold mb-2">
          댓글{" "}
          <span className="text-[#8b0000]">{post.commentCount}</span>
        </div>
        <CommentSection
          postId={post.id}
          gallerySlug={slug}
          comments={JSON.parse(JSON.stringify(comments))}
          isLoggedIn={!!session}
          currentUserId={currentUserId}
        />
      </div>

      {/* Bottom navigation */}
      <div className="flex items-center justify-between mt-4">
        <Link
          href={`/gallery/${slug}`}
          className="dc-btn dc-btn-secondary"
        >
          목록
        </Link>
        {session && (
          <Link
            href={`/gallery/${slug}/write`}
            className="dc-btn dc-btn-primary"
          >
            글쓰기
          </Link>
        )}
      </div>
    </div>
  );
}
