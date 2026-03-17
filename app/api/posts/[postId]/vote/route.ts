import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CONCEPT_THRESHOLD } from "@/lib/constants";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const { postId } = await params;
    const { value } = await request.json();

    if (value !== 1 && value !== -1) {
      return NextResponse.json(
        { error: "잘못된 투표 값입니다." },
        { status: 400 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { author: true },
    });

    if (!post || post.isDeleted) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // Prevent self-voting
    if (post.authorId === session.user.id) {
      return NextResponse.json(
        { error: "자신의 글에는 투표할 수 없습니다." },
        { status: 400 }
      );
    }

    // Check for existing vote
    const existingVote = await prisma.postVote.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId,
        },
      },
    });

    if (existingVote) {
      return NextResponse.json(
        { error: "이미 투표하셨습니다." },
        { status: 409 }
      );
    }

    // Create vote and update counts in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create vote
      await tx.postVote.create({
        data: {
          value,
          userId: session.user.id,
          postId,
        },
      });

      // Update post vote counts
      const updatedPost = await tx.post.update({
        where: { id: postId },
        data:
          value === 1
            ? { upvoteCount: { increment: 1 } }
            : { downvoteCount: { increment: 1 } },
      });

      // Update author stats
      await tx.user.update({
        where: { id: post.authorId },
        data:
          value === 1
            ? {
                totalUpvotes: { increment: 1 },
                points: { increment: 1 },
              }
            : {
                totalDownvotes: { increment: 1 },
                points: { decrement: 1 },
              },
      });

      // Update university total points
      await tx.university.update({
        where: { id: post.author.universityId },
        data:
          value === 1
            ? { totalPoints: { increment: 1 } }
            : { totalPoints: { decrement: 1 } },
      });

      // Promote to CONCEPT if threshold reached
      if (
        updatedPost.upvoteCount >= CONCEPT_THRESHOLD &&
        updatedPost.postType === "NORMAL"
      ) {
        await tx.post.update({
          where: { id: postId },
          data: { postType: "CONCEPT" },
        });
      }

      return updatedPost;
    });

    return NextResponse.json({
      upvoteCount: result.upvoteCount,
      downvoteCount: result.downvoteCount,
    });
  } catch (error) {
    console.error("Post vote error:", error);
    return NextResponse.json(
      { error: "투표 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
