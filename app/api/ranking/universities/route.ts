import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const skip = (page - 1) * limit;

    const [universities, total] = await Promise.all([
      prisma.university.findMany({
        orderBy: { totalPoints: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          shortName: true,
          domain: true,
          logoUrl: true,
          region: true,
          totalPoints: true,
          memberCount: true,
          avgPoints: true,
          rank: true,
        },
      }),
      prisma.university.count(),
    ]);

    // Assign rank based on position
    const ranked = universities.map((uni, index) => ({
      ...uni,
      rank: skip + index + 1,
    }));

    return NextResponse.json({
      universities: ranked,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("University ranking error:", error);
    return NextResponse.json(
      { error: "대학 랭킹을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
