import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PAGE_SIZE } from "@/lib/constants";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const type = searchParams.get("type") as
      | "NORMAL"
      | "CONCEPT"
      | "NOTICE"
      | null;
    const sort = searchParams.get("sort") || "latest";
    const limit = PAGE_SIZE;
    const skip = (page - 1) * limit;

    const gallery = await prisma.gallery.findUnique({
      where: { slug },
    });

    if (!gallery || !gallery.isActive) {
      return NextResponse.json(
        { error: "게시판를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const where: any = {
      galleryId: gallery.id,
      isDeleted: false,
    };

    if (type) {
      where.postType = type;
    }

    const orderBy =
      sort === "popular"
        ? [{ upvoteCount: "desc" as const }, { createdAt: "desc" as const }]
        : [{ createdAt: "desc" as const }];

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: { id: true, nickname: true },
          },
        },
        orderBy,
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
    console.error("Gallery posts fetch error:", error);
    return NextResponse.json(
      { error: "게시글 목록을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const { slug } = await params;
    const { title, content, contentText } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "제목과 내용을 입력해주세요." },
        { status: 400 }
      );
    }

    const gallery = await prisma.gallery.findUnique({
      where: { slug },
    });

    if (!gallery || !gallery.isActive) {
      return NextResponse.json(
        { error: "게시판를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // Auto-increment number per gallery
    const lastPost = await prisma.post.findFirst({
      where: { galleryId: gallery.id },
      orderBy: { number: "desc" },
      select: { number: true },
    });

    const nextNumber = (lastPost?.number || 0) + 1;

    const post = await prisma.post.create({
      data: {
        number: nextNumber,
        title,
        content,
        contentText: contentText || null,
        authorId: session.user.id,
        galleryId: gallery.id,
        universityName: session.user.universityName,
      },
    });

    // Update gallery post count
    await prisma.gallery.update({
      where: { id: gallery.id },
      data: {
        postCount: { increment: 1 },
        todayPostCount: { increment: 1 },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Post create error:", error);
    return NextResponse.json(
      { error: "게시글 작성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
