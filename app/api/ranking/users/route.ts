import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: { isBanned: false },
        orderBy: { points: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          nickname: true,
          points: true,
          totalUpvotes: true,
          totalDownvotes: true,
          university: {
            select: {
              id: true,
              name: true,
              shortName: true,
            },
          },
          createdAt: true,
        },
      }),
      prisma.user.count({ where: { isBanned: false } }),
    ]);

    const ranked = users.map((user, index) => ({
      ...user,
      rank: skip + index + 1,
    }));

    return NextResponse.json({
      users: ranked,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("User ranking error:", error);
    return NextResponse.json(
      { error: "유저 랭킹을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
