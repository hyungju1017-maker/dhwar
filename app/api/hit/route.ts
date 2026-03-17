import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { HIT_THRESHOLD } from "@/lib/constants";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "30", 10);
    const skip = (page - 1) * limit;

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const where = {
      isDeleted: false,
      createdAt: { gte: twentyFourHoursAgo },
      upvoteCount: { gte: HIT_THRESHOLD },
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: { id: true, nickname: true },
          },
          gallery: {
            select: { id: true, name: true, slug: true },
          },
        },
        orderBy: { upvoteCount: "desc" },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Hit posts error:", error);
    return NextResponse.json(
      { error: "실시간 베스트를 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
