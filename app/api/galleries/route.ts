import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PAGE_SIZE } from "@/lib/constants";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as "MAJOR" | "MINOR" | "MINI" | null;
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || String(PAGE_SIZE), 10);
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };

    if (type) {
      where.type = type;
    }

    if (category) {
      where.category = { slug: category };
    }

    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }

    const [galleries, total] = await Promise.all([
      prisma.gallery.findMany({
        where,
        include: { category: true },
        orderBy: [{ postCount: "desc" }, { name: "asc" }],
        skip,
        take: limit,
      }),
      prisma.gallery.count({ where }),
    ]);

    return NextResponse.json({
      galleries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Galleries fetch error:", error);
    return NextResponse.json(
      { error: "게시판 목록을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
