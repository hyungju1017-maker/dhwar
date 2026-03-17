import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const { commentId } = await params;
    const { value } = await request.json();

    if (value !== 1 && value !== -1) {
      return NextResponse.json(
        { error: "잘못된 투표 값입니다." },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { author: true },
    });

    if (!comment || comment.isDeleted) {
      return NextResponse.json(
        { error: "댓글을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // Prevent self-voting
    if (comment.authorId === session.user.id) {
      return NextResponse.json(
        { error: "자신의 댓글에는 투표할 수 없습니다." },
        { status: 400 }
      );
    }

    // Check for existing vote
    const existingVote = await prisma.commentVote.findUnique({
      where: {
        userId_commentId: {
          userId: session.user.id,
          commentId,
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
      await tx.commentVote.create({
        data: {
          value,
          userId: session.user.id,
          commentId,
        },
      });

      // Update comment vote counts
      const updatedComment = await tx.comment.update({
        where: { id: commentId },
        data:
          value === 1
            ? { upvoteCount: { increment: 1 } }
            : { downvoteCount: { increment: 1 } },
      });

      // Update author stats
      await tx.user.update({
        where: { id: comment.authorId },
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
        where: { id: comment.author.universityId },
        data:
          value === 1
            ? { totalPoints: { increment: 1 } }
            : { totalPoints: { decrement: 1 } },
      });

      return updatedComment;
    });

    return NextResponse.json({
      upvoteCount: result.upvoteCount,
      downvoteCount: result.downvoteCount,
    });
  } catch (error) {
    console.error("Comment vote error:", error);
    return NextResponse.json(
      { error: "투표 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
